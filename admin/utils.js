//-------------------------------------------------------------------
export function continuousPagination(res) {
  let key = Object.keys(res.data.data)[0];
  let hasNext = res.data.data[key].pageInfo.hasNextPage;
  let next = hasNext && {
    after: res.data.data[key].pageInfo.endCursor
  };
  return {
    type: "continuous",
    next,
    resultsTotal: res.data.data[key].totalCount,
    filteredTotal: res.data.data[key].filteredCount
  };
}
export function continuousPaginationUser(res) {
  const count = res.data.data.admin.users.count;
  const limit = res.data.data.admin.users.limit;
  const currentPage = res.data.data.admin.users.page + 1;

  let allPages = [];
  for (let i = 0; i < parseInt(count / limit); i++) {
    allPages[i] = `${i + 1}`;
  }
  if (count % limit !== 0) {
    allPages[allPages.length] = String(allPages.length + 1);
  }

  return {
    type: "numbered",
    allPages,
    currentPage,
    resultsTotal: count,
    filteredTotal: count
  };
}

//-------------------------------------------------------------------
function objectToArgs(object) {
  let args = Object.getOwnPropertyNames(object)
    .map(name => {
      return `${name}: ${JSON.stringify(object[name])}`;
    })
    .join(", ");
  return args ? `(${args})` : "";
}

function sorting(req) {
  if (req.sorting && req.sorting.length > 0) {
    return {
      orderBy: req.sorting
        .map(field => {
          let prefix = field.sorted == "ascending" ? "" : "-";
          return prefix + field.sortKey;
        })
        .join(",")
    };
  }
  return {};
}

export function listQuery(options) {
  if (Object.prototype.toString.call(options.fields) === "[object Array]") {
    options.fields = options.fields.join(", ");
  }
  return req => {
    let args = objectToArgs(Object.assign({}, options.args, req.page, req.filters, sorting(req)));
    return `{
            ${options.name} ${args} {
                totalCount, filteredCount,
                pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
                edges { node { ${options.fields} }}
            }
        }`;
  };
}

//-------------------------------------------------------------------
export function join(p1, p2, var1, var2, defaultValue = {}) {
  return Promise.all([p1, p2]).then(responses => {
    return responses[0].set(
      "data",
      responses[0].data.map(item => {
        item[var1] = responses[1].data.find(obj => obj[var2] == item[var1]);
        if (!item[var1]) {
          item[var1] = defaultValue;
        }
        return item;
      })
    );
  });
}

// Credits for this function go to https://gist.github.com/mathewbyrne
export function slugify(text) {
  if (typeof text !== "undefined") {
    return text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, ""); // Replace spaces with - // Remove all non-word chars // Replace multiple - with single - // Trim - from start of text // Trim - from end of text
  }
  return undefined;
}

export function formatDate(date) {
  return date.toJSON().slice(0, 10);
}

export function formatStringToDate(dateStr) {
  let date = new Date(dateStr);
  return date.toJSON().slice(0, 10);
}

/* transform mongoose error to redux-form (object) error
mongoose:
[
    "__all__": "message",
    "key": "message"
]
redux-form:
[
    "_error": "message",
    "key": "message"
]
*/
export function transformErrors(errors) {
  const errorsObj = {};
  if (errors !== null && Array === errors.constructor) {
    for (let i = 0; i < errors.length; i = i + 2) {
      errorsObj["_error"] = errors[i].message;
    }
    return errorsObj;
  }
  return errors;
}
