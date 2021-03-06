import { isEmpty } from '@ember/utils';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  namespace: 'v1',

  createOrUpdate(store, type, snapshot) {
    const serializer = store.serializerFor(type.modelName);
    const data = serializer.serialize(snapshot);
    const { id } = snapshot;

    return this.ajax(this.urlForSecret(snapshot.attr('backend'), id), 'POST', { data });
  },

  createRecord() {
    return this.createOrUpdate(...arguments);
  },

  updateRecord() {
    return this.createOrUpdate(...arguments);
  },

  deleteRecord(store, type, snapshot) {
    const { id } = snapshot;
    return this.ajax(this.urlForSecret(snapshot.attr('backend'), id), 'DELETE');
  },

  urlForSecret(backend, id) {
    let url = `${this.buildURL()}/${backend}/`;
    if (!isEmpty(id)) {
      url = url + id;
    }

    return url;
  },

  optionsForQuery(id, action) {
    let data = {};
    if (action === 'query') {
      data['list'] = true;
    }

    return { data };
  },

  fetchByQuery(query, action) {
    const { id, backend } = query;
    return this.ajax(this.urlForSecret(backend, id), 'GET', this.optionsForQuery(id, action)).then(resp => {
      resp.id = id;
      return resp;
    });
  },

  query(store, type, query) {
    return this.fetchByQuery(query, 'query');
  },

  queryRecord(store, type, query) {
    return this.fetchByQuery(query, 'queryRecord');
  },
});
