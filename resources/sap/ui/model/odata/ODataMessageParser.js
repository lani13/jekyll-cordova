/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/library","sap/ui/core/message/MessageParser","sap/ui/core/message/Message"],function(q,c,M,a){"use strict";var s={"error":sap.ui.core.MessageType.Error,"warning":sap.ui.core.MessageType.Warning,"success":sap.ui.core.MessageType.Success,"info":sap.ui.core.MessageType.Information};var O=M.extend("sap.ui.model.odata.ODataMessageParser",{metadata:{publicMethods:["parse","setProcessor","getHeaderField","setHeaderField"]},constructor:function(S,m){M.apply(this);this._serviceUrl=b(S);this._metadata=m;this._processor=null;this._headerField="sap-message";this._lastMessages=[];}});O.prototype.getHeaderField=function(){return this._headerField;};O.prototype.setHeaderField=function(f){this._headerField=f;return this;};O.prototype.parse=function(r,R,G,C){var m=[];var e=R?R.requestUri:r.requestUri;if(r.statusCode>=200&&r.statusCode<300){this._parseHeader(m,r,e);}else if(r.statusCode>=400&&r.statusCode<600){this._parseBody(m,r,e);}else{q.sap.log.warning("No rule to parse OData response with status "+r.statusCode+" for messages");}if(!this._processor){this._outputMesages(m);}this._propagateMessages(m,e,G,C);};O.prototype._getAffectedTargets=function(m,r,G,C){var A=q.extend({"":true},G,C);var R=b(r);if(R.indexOf(this._serviceUrl)===0){R=R.substr(this._serviceUrl.length+1);}var e=this._metadata._getEntitySetByPath(R);if(e){A[e.name]=true;}for(var i=0;i<m.length;++i){var t=m[i].getTarget();if(t){e=this._metadata._getEntitySetByPath(t);if(e){A[e.name]=true;}}}return A;};O.prototype._propagateMessages=function(m,r,G,C){var i,t;var A=this._getAffectedTargets(m,r,G,C);for(i=0;i<m.length;++i){t=m[i].getTarget();if(!A[t]){q.sap.log.error("Service returned messages for entities that were not requested. "+"This might lead to wrong message processing and loss of messages");A[t]=true;}}var R=[];var k=[];for(i=0;i<this._lastMessages.length;++i){t=this._lastMessages[i].getTarget();if(A[t]){R.push(this._lastMessages[i]);}else{k.push(this._lastMessages[i]);}}this.getProcessor().fireMessageChange({oldMessages:R,newMessages:m});this._lastMessages=k.concat(m);};O.prototype._createMessage=function(m,r,i){var t=m["@sap.severity"]?m["@sap.severity"]:m["severity"];t=s[t]?s[t]:t;var C=m.code?m.code:"";var T=typeof m["message"]==="object"&&m["message"]["value"]?m["message"]["value"]:m["message"];var e=this._createTarget(m,r);return new a({type:t,code:C,message:T,target:e,processor:this._processor,technical:i});};O.prototype._createTarget=function(m,r){var t="";if(m.target){t=m.target;}else if(m.propertyref){t=m.propertyref;}if(t.substr(0,1)!=="/"){var R="";var u=b(r);if(u.indexOf(this._serviceUrl)===0){R="/"+u.substr(this._serviceUrl.length+1);}else{R="/"+u;}var S=R.lastIndexOf("/");var e=S>-1?R.substr(S):R;if(e.indexOf("(")>-1){t=R+"/"+t;}else{t=R+t;}}return t;};O.prototype._parseHeader=function(m,r,R){var f=this.getHeaderField();if(!r.headers||!r.headers[f]){return;}var e=r.headers[f];var S=null;try{S=JSON.parse(e);m.push(this._createMessage(S,R));if(S.details&&q.isArray(S.details)){for(var i=0;i<S.details.length;++i){m.push(this._createMessage(S.details[i],R));}}}catch(h){q.sap.log.error("The message string returned by the back-end could not be parsed");return;}};O.prototype._parseBody=function(m,r,R){var C=g(r);if(C&&C.indexOf("xml")>-1){this._parseBodyXML(m,r,R,C);}else{this._parseBodyJSON(m,r,R);}};O.prototype._parseBodyXML=function(e,r,R,C){try{var D=new DOMParser();var o=D.parseFromString(r.body,C);var p="//*[local-name()='error'] | "+"//*[local-name()='errordetails']/*[local-name()='errordetail'] | "+"//*[local-name()='details']/*[local-name()='error']";var X=d();var N=X.selectNodes(o,p);for(var i=0;i<N.length;++i){var f=X.nextNode(N,i);var E={};E["severity"]=sap.ui.core.MessageType.Error;for(var n=0;n<f.childNodes.length;++n){var h=f.childNodes[n];var j=h.nodeName;if(j==="errordetails"||j==="details"||j==="innererror"){continue;}if(j==="message"&&h.hasChildNodes()&&h.firstChild.nodeType!==window.Node.TEXT_NODE){for(var m=0;m<h.childNodes.length;++m){if(h.childNodes[m].nodeName==="value"){E["message"]=X.getNodeText(h.childNodes[m]);}}}else{E[h.nodeName]=X.getNodeText(h);}}e.push(this._createMessage(E,R,true));}}catch(k){q.sap.log.error("Error message returned by server could not be parsed");}};O.prototype._parseBodyJSON=function(m,r,R){try{var e=JSON.parse(r.body);var E;if(e["error"]){E=e["error"];}else{E=e["odata.error"];}if(!E){q.sap.log.error("Error message returned by server did not contain error-field");return;}E["severity"]=sap.ui.core.MessageType.Error;m.push(this._createMessage(E,R,true));var f=null;if(q.isArray(E.details)){f=E.details;}else if(E.innererror&&q.isArray(E.innererror.errordetails)){f=E.innererror.errordetails;}else{f=[];}for(var i=0;i<f.length;++i){m.push(this._createMessage(f[i],R,true));}}catch(h){q.sap.log.error("Error message returned by server could not be parsed");}};O.prototype._outputMesages=function(m){for(var i=0;i<m.length;++i){var o="[OData Message] "+m.getMessage()+" - "+m.getDexcription()+" ("+m.getTarget()+")";switch(m[i].getSeverity()){case"error":q.sap.log.error(o);break;case"warning":q.sap.log.warning(o);break;case"success":q.sap.log.debug(o);break;case"info":default:q.sap.log.info(o);break;}}};function g(r){if(r&&r.headers){for(var h in r.headers){if(h.toLowerCase()==="content-type"){return r.headers[h];}}}return false;}function b(u){var p=-1;var S=u;p=u.indexOf("?");if(p>-1){S=S.substr(0,p);}p=u.indexOf("#");if(p>-1){S=S.substr(0,p);}return S;}var x=null;function d(){if(x===null){x={};if(sap.ui.Device.browser.msie){x={selectNodes:function(S,p){return S.selectNodes(p);},nextNode:function(n){return n.nextNode();},getNodeText:function(n){return n.text;}};}else{x={selectNodes:function(S,p){var e=S.evaluate(p,S,null,7,null);e.length=e.snapshotLength;return e;},nextNode:function(n,i){return n.snapshotItem(i);},getNodeText:function(n){return n.textContent;}};}}return x;}return O;});
