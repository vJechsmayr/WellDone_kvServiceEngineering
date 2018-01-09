package com.example.welldone.server.model;

public interface IServerResponseCallback {
	
	BaseServerResponse CreateResponseFromJson(String json);
	
	void OnResponseReceived(BaseServerResponse response);

}
