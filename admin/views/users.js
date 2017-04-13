import React from 'react'
import NumberField from '../fields/NumberField';

//-------------------------------------------------------------------
var listView = {
    path: 'users',
    title: 'Users',
    actions: {
        list: function (req) {
            return crudl.connectors.users.read(req)
        },
    },
    normalize: (list) => list.map(item => {
        if (!item.last_name) {
            item.full_name = item.first_name
        } else if (!item.first_name) {
            item.full_name = <span><b>{item.last_name}</b></span>
        } else {
            item.full_name = <span><b>{item.last_name}</b>, {item.first_name}</span>
        }
        return item
    })
}

listView.fields = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'username',
        label: 'Username',
        sortable: false,
        sorted: 'ascending',
        main: true,
    },
    {
        name: 'firstname',
        label: 'First name',
    },
    {
        name: 'lastname',
        label: 'Last name',
    },
    {
        name: 'email',
        label: 'Email address',
    },
    {
        name: 'isAdministrator',
        label: 'Is Admin',
        render: 'boolean',
    }
]

//-------------------------------------------------------------------
var changeView = {
    path: 'users/:id',
    title: 'User',
    actions: {
        get: function (req) { return crudl.connectors.user(crudl.path.id).read(req) },
        save: function (req) { return crudl.connectors.user(crudl.path.id).update(req) },
        delete: function (req) {

            //Only get req.data.id
            delete req.data.email;
            delete req.data.firstname;
            delete req.data.isAdministrator;
            delete req.data.lastname;
            delete req.data.password;
            delete req.data.password_confirm;
            delete req.data.username;

            return crudl.connectors.user(crudl.path.id).delete(req)
        }
    },
    normalize: (get) => {
        let date = new Date(get.date_joined)
        get.date_joined = date.toJSON()
        return get
    },
    denormalize: (data) => {
        /* prevent unknown field ... with query */
        delete(data.date_joined)
        delete(data.password_confirm)
        return data
    }
}

changeView.fieldsets = [
    {
        fields:[
            {
                name:'id',
                label: 'ID',
                field: NumberField,
                readOnly: true
            }
        ]
    },
    {
        fields: [
            {
                name: 'username',
                label: 'Username',
                field: 'String'
            },
        ],
    },
    {
        fields: [
            {
                name: 'firstname',
                label: 'Name',
                field: 'String',
            },
            {
                name: 'lastname',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String'
            }
        ],
    },
    {
        title: 'Roles',
        expanded: true,
        description: () => {
            if (crudl.auth.user == crudl.path.id) {
                return <span style={{color: '#CC293C'}}>WARNING: If you remove crudl access for the currently logged-in user, you will be logged out and unable to login with this user again.</span>
            }
        },
        fields: [
            {
                name: 'isAdministrator',
                label: 'Administrator',
                field: 'Checkbox',
                initialValue: true
            }
        ],
    },
    {
        title: 'Password',
        expanded: false,
        // Hide this fieldset if the logged-in user is not the owner
        hidden: () => crudl.auth.user !== crudl.path.id,
        description: "Raw passwords are not stored, so there is no way to see this user's password, but you can set a new password.",
        fields: [
            {
                name: 'password',
                label: 'Password',
                field: 'Password',
            },
            {
                name: 'password_confirm',
                label: 'Password (Confirm)',
                field: 'Password',
                validate: (value, allValues) => {
                    if (value != allValues.password) {
                        return 'The passwords do not match.'
                    }
                }
            },
        ]
    }
]

//-------------------------------------------------------------------
var addView = {
    path: 'users/new',
    title: 'New User',
    denormalize: changeView.denormalize,
    actions: {
        add: function (req) { return crudl.connectors.users.create(req) },
    },
}

addView.fieldsets = [
    {
        fields: [
            {
                name: 'username',
                label: 'Username',
                field: 'String',
                validate: (value, allValues) => {
                    if(!value || value === undefined){
                        return 'Username is not null';
                    }
                }
            },
        ],
    },
    {
        fields: [
            {
                name: 'firstname',
                label: 'Name',
                field: 'String',
            },
            {
                name: 'lastname',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String',
            }
        ],
    }
]


module.exports = {
    listView,
    changeView,
    addView,
}
