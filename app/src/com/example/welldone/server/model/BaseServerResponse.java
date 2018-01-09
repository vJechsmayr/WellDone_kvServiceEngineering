package com.example.welldone.server.model;

import java.util.Map;

import com.google.gson.Gson;

public class BaseServerResponse {

	private boolean success;
	private String message;
	private Map<String, Object> requestParameters;
	private IServerResponseCallback callback;
	
	public BaseServerResponse() {
		this(false, null);
	}
	
	public BaseServerResponse(boolean success, String message) {
		this.success = success;
		this.message = message;
	}
	
	public boolean getSuccess() {
		return success;
	}
	
	public void setSuccess(boolean success) {
		this.success = success;
	}
	
	public String getMessage(){
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public IServerResponseCallback getCallback() {
		return callback;
	}
	
	public Map<String, Object> getRequestParameters() {
		return requestParameters;
	}
	
	public void setRequestParameters(Map<String, Object> requestParameters) {
		this.requestParameters = requestParameters;
	}
	
	public void setCallback(IServerResponseCallback callback){
		this.callback = callback;
	}
	
	public static BaseServerResponse fromJson(String json) {
		return new Gson().fromJson(json, BaseServerResponse.class);
	}
}

