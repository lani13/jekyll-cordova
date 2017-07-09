jQuery.sap.declare('elasticsearch.CategoryAggregations');

elasticsearch.CategoryAggregations = {

    host: 'http://localhost:9200/',
    index_name: 'jekyll-shakestat-20170704212720',
    search_route: '/_search',

    body: {
      size: 0,
      aggs: {
        categories: {
            terms: { 'field' : 'categories.keyword' }
        }
      }
    },

    get_category_aggs: function(){
      params = JSON.stringify(this.body);
	    elastic_url = this.host + this.index_name + this.search_route;

      $.ajax({
        type: 'POST',
        url: elastic_url,
        dataType: 'json',
        data: params
      }).success(function(response){
        if(response['aggregations']){
          cats = response['aggregations']['categories']['buckets']
          sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'aggregationsLoaded', {categories: cats});
        }
        else{
          sap.m.MessageToast.show('No aggregations');
        }   
      }).error(function(jqXHR, status, errorThrown) {
        sap.m.MessageToast.show('Network error');
      });
    }
};