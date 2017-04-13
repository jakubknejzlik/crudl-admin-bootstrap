import { continuousPagination, continuousPaginationUser, listQuery, transformErrors } from "../utils";

const LIMIT_PAGE = 30;

module.exports = {
  // USERS
  users: {
    query: {
      read: `{
                  admin{
                    users(limit: %limit, offset: %offset){
                      items{
                        id,
                        firstname,
                        lastname,
                        email,
                        username,
                        isAdministrator
                      },
                      count,
                      limit,
                      offset,
                      page
                    }
                  }
                }
                `,
      create: `mutation ($input: UserInput!){
                  updateUser(input:$input){
                    user{
                      id,
                      username,
                      firstname,
                      lastname,
                      email
                    }
                  }
                }`
    },
    pagination: continuousPaginationUser,
    transform: {
      readRequest: req => {
        let reqClone = Object.assign({}, req);

        reqClone.page = reqClone.page ? reqClone.page : 1;

        const offset = (reqClone.page - 1) * LIMIT_PAGE;

        reqClone.params = { limit: LIMIT_PAGE, offset: offset };

        return reqClone;
      },
      readResponseData: data => {
        return data.data.admin.users.items;
      },
      createResponseData: data => {
        if (data.errors) {
          throw new crudl.ValidationError(transformErrors(data.errors));
        }
        return data.data.updateUser.user;
      }
    }
  },
  user: {
    query: {
      read: `{
                admin{
                    user(id: %id){
                        id,
                        username,
                        firstname,
                        lastname,
                        email,
      			            isAdministrator
                    }
                }
            }`,
      update: `mutation ($input: UserInput!) {
                updateUser(input: $input) {
                    user{
                        id,
                        username,
                        firstname,
                        lastname,
                        email
                    }
                }
            }`,
      delete: `mutation ( $input: DeleteUserInput!){
                deleteUser( input: $input){
                    user{
                        id,
                        username,
                          firstname,
                          lastname,
                          email
                    }
                }
            }`
    },
    transform: {
      readResponseData: data => {
        if (data.errors) {
          throw new crudl.NotFoundError("The requested user was not found");
        }
        return data.data.admin.user;
      },
      updateRequestData: data => {
        delete data.isAdministrator;

        return data;
      },
      updateResponseData: data => {
        return data.data.updateUser.user;
      },
      // deleteRequestData: data => ({ id: data.id }),
      deleteResponseData: data => data.data
    }
  },

  // SPECIAL CONNECTORS

  // sections_options
  // a helper for retrieving the sections used with select fields
  sections_options: {
    query: {
      read: `{allSections{edges{node{_id, name}}}}`
    },
    transform: {
      readResponseData: data => ({
        options: data.data.allSections.edges.map(function(item) {
          return { value: item.node._id, label: item.node.name };
        })
      })
    }
  },

  // category_options
  // a helper for retrieving the categories used with select fields
  categories_options: {
    query: {
      read: listQuery({
        name: "allCategories",
        fields: "_id, name, slug"
      })
    },
    transform: {
      readResponseData: data => ({
        options: data.data.allCategories.edges.map(function(item) {
          return { value: item.node._id, label: item.node.name };
        })
      })
    }
  },

  // tags_options
  // a helper for retrieving the tags used with select fields
  tags_options: {
    query: {
      read: listQuery({
        name: "allTags",
        fields: "_id, name"
      })
    },
    transform: {
      readResponseData: data => ({
        options: data.data.allTags.edges.map(function(item) {
          return { value: item.node._id, label: item.node.name };
        })
      })
    }
  },

  login: {
    query: {
      read: `mutation ($input: AuthorizationInput!){
                    authorize(input:$input){
                        token,
                        user{
                            id,
                            username
                        },
                        clientMutationId
                    }
                }`
    },
    transform: {
      readResponseData: data => {
        let dataCRUDL = {};
        dataCRUDL.username = data.data.authorize.user.username;
        dataCRUDL.token = data.data.authorize.token;
        dataCRUDL.user = 1;
        dataCRUDL.permission_list = [
          {
            blogentry: {
              create: false,
              read: true,
              update: true,
              delete: true,
              list: true
            }
          }
        ];

        return {
          requestHeaders: { Authorization: `Bearer ${dataCRUDL.token}` },
          info: dataCRUDL
        };
      }
    }
  }
};
