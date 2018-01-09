package com.example.welldone.server.model;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

public class ServerRequest {

	private static URL baseUrl;
	
	private URL url;
	private IServerResponseCallback callback;
	private Map<String, Object> parameters;
	
	static {
		try {
			baseUrl = new URL("http://ec2-52-24-136-229.us-west-2.compute.amazonaws.com:8081/");
		} catch (MalformedURLException e) {
		}
	}
	
	public ServerRequest(String url, IServerResponseCallback callback) {
		try {
			this.url = new URL(baseUrl, url);
		} catch (MalformedURLException e) {
			this.url = null;
		}
		this.callback = callback;
		this.parameters = new HashMap<String, Object>();
	}
	
	public void addParameter(String name, Object value) {
		parameters.put(name, value);
	}
	
	public URL getUrl() {
		return url;
	}
	
	public IServerResponseCallback getCallback(){
		return callback;
	}
	
	public Map<String, Object> getParameters(){
		return parameters;
	}
	
	public String toJson() throws JSONException {
		return new JSONObject(parameters).toString();
	}
}
