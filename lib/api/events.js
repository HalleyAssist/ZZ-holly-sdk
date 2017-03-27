import got from "got";
import moment from "moment";
import inflection from "inflection";

export class EventsAPI {
  constructor(app) {
    this.app = app;
  }

  /**
   * Takes a single object containing query options
   * and returns a list of events matching the given options
   *
   * Options:
   * - occurredBefore:  (String|Date|moment)
   * - occurredAfter:   (String|Date|moment)
   * - type:            (String) ['device', 'task_schedule']
   * - action:          (String) ['active', 'inactive', 'open', 'closed']
   *
   * @param {Object} queryOptions
   * @return {Array} events
   */
  getEvents(queryOptions) {
    let query = this._translateQueryOptions(queryOptions);

    return got(`${this.app.api.url}/events`, {
      method: "GET",
      json: true,
      query
    }).then(res => {
      return res.body.events;
    });
  }

  _translateQueryOptions(queryOptions) {
    let query = {};

    // Before date
    if (queryOptions.occurredBefore) {
      query.occurred_before = moment(queryOptions.occurredBefore)
                                    .utc()
                                    .format();
    }

    // After date
    if (queryOptions.occurredAfter) {
      query.occurred_after = moment(queryOptions.occurredAfter)
                                   .utc()
                                   .format();
    }

    // Event type (e.g. 'DeviceEvent', 'TaskScheduleEvent')
    if (queryOptions.type) {
      // Ensure types is an arry
      let types = [].concat(queryOptions.type);

      // Inflect from 'device' to 'DeviceEvent'
      if (types && types.length > 0) {
        query["type[]"] = types.map(type => `${inflection.classify(type)}Event`);
      }
    }

    // Action (e.g. 'active', 'inactive', 'open', 'closed')
    if (queryOptions.action) {
      query["action_type[]"] = queryOptions.action;
    }

    return query;
  }
}
