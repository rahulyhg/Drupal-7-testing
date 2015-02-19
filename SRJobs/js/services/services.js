/**
 * @todo - inject the API KEY into these resources so it doesn't need to be parsed everytime.
 */

srJobs.factory("GCEntity", function ($resource) {
  return $resource(API_URL + ":port/entity",
    {port: ':' + API_PORT, name: '@name', api_key: '@api_key'}
  );
});

srJobs.factory("Organisation", function ($resource) {
  return $resource(API_URL + ":port/entity.json/organisation/profile2?api_key=:api_key",
    {port: ':' + API_PORT, api_key: '@api_key'}
  );
});

srJobs.factory("WorkDiary", function ($resource) {
  return $resource(API_URL + ":port/entity/work_diary/simple/:id.json?api_key=:api_key",
    {port: ':' + API_PORT, id: '@id', api_key: '@api_key'}, {
      save: {
        method: "POST",
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      }
    }
  );
});

srJobs.factory("Login", function ($resource) {
  return $resource(API_URL + ":port/account/login.json",
    {port: ':' + API_PORT}, {
      save: {
        method: "POST",
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      }
    }
  );
});

srJobs.factory("Notification", function ($resource) {
  return $resource(API_URL + ":port/entity/notification/simple/:id.json?api_key=:api_key",
    {port: ':' + API_PORT, id: '@id', api_key: '@api_key'}
  );
});

srJobs.factory("Profile", function ($resource) {
  return $resource(API_URL + ":port/entity/personal/profile2/:id.json?api_key=:api_key",
    {port: ':' + API_PORT, id: '@id', api_key: '@api_key'}, {
      update: {
        method: "PUT",
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      }
    }
  );
});

srJobs.factory("Role", function ($resource) {
  return $resource(API_URL + ":port/entity.json/role/simple/:id.json?api_key=:api_key",
    {port: ':' + API_PORT, id: '@id', api_key: '@api_key'}, {
      save: {
        method: "POST",
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      },
      update: {
        method: "PUT",
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      }
    }
  );
});

srJobs.factory("Personal", function ($resource) {
  return $resource(API_URL + ":port/entity.json/personal/profile2?api_key=:api_key",
    {port: ':' + API_PORT, api_key: '@api_key'}
  );
});


srJobs.factory("CandidateShortlist", function ($resource) {
  return $resource(API_URL + ":port/entity.json/candidate_short_list/simple?api_key=:api_key",
    {port: ':' + API_PORT, api_key: '@api_key'}, {
      save: {
        method: "POST",
        headers: {"Content-Type": "application/json;charset=UTF-8"}
      }
    }
  );
});