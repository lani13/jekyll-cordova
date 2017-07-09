jQuery.sap.declare('elasticsearch.Search');

elasticsearch.Search = {

    host: 'http://localhost:9200/',
    index_name: 'jekyll-shakestat-20170704212720',
    search_route: '/_search',

    body_1: {
      'query': {
        'simple_query_string': { 
          'query': '',
          'fields': ['excerpt', 'text']
          
        }
      }
    },

    body_2: {
      'query': {
        'multi_match': { 
          'query': '',
          'fields': ['excerpt', 'text']
          
        }
      }
    },

    body_3: {
      'query' : {
        'term' : { 'categories.keyword' : 'romance' }
      }
    },

    body_4: {
      'query' : {
        'term' : { 'slug.keyword': '' }
      }
    },

    search: function(query_string){  
      this.body_1['query']['simple_query_string']['query'] = query_string

      params = JSON.stringify(this.body_1);
	    elastic_url = this.host + this.index_name + this.search_route;

      $.ajax({
        type: 'post',
        url: elastic_url,
        dataType: 'json',
        data: params
      }).success(function(response){
        if(response['hits']['total'] > 0){
          docs = response['hits']['hits']
          sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'documentsLoaded', { documents: docs });
        }
        else{
          sap.m.MessageToast.show('No documents');
        }   
      }).error(function(jqXHR, status, errorThrown) {
        sap.m.MessageToast.show('Network error');
      });
    },

    search_by_slug: function(slug){  
      this.body_4['query']['term']['slug.keyword'] = slug

      params = JSON.stringify(this.body_4);
	    elastic_url = this.host + this.index_name + this.search_route;

      $.ajax({
        type: 'post',
        url: elastic_url,
        dataType: 'json',
        data: params
      }).success(function(response){
        if(response['hits']['total'] > 0){
          doc = response['hits']['hits'][0]
          sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'documentFound', { document: doc });
        }
        else{
          sap.m.MessageToast.show('No documents');
        }   
      }).error(function(jqXHR, status, errorThrown) {
        sap.m.MessageToast.show('Network error');
      });
    }
};