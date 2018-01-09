package com.example.welldone.server;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpURLConnection;

import com.example.welldone.server.model.BaseServerResponse;
import com.example.welldone.server.model.ServerRequest;

import android.os.AsyncTask;

public class ServerRequestHelper extends AsyncTask<ServerRequest, Void, BaseServerResponse> {
	
	static {
		CookieHandler.setDefault(new CookieManager(null, CookiePolicy.ACCEPT_ALL));
	}
	
	@Override
	protected BaseServerResponse doInBackground(ServerRequest... requests) {

		ServerRequest request = requests[0];
		BaseServerResponse response;
		
		try {
			
			String charset = "UTF-8";
			
			HttpURLConnection client = (HttpURLConnection) request.getUrl().openConnection();
			
			client.setDoOutput(true);
			client.setRequestProperty("Content-Type", "application/json;charset=" + charset);
			
			OutputStream output = client.getOutputStream();
			output.write(request.toJson().getBytes(charset));
			output.flush();
			output.close();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(client.getInputStream()));
			StringBuilder responseJson = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				responseJson.append(line).append('\n');
			}
			
			response = request.getCallback().CreateResponseFromJson(responseJson.toString());
		} catch (Exception e) {
			response = new BaseServerResponse(false, "Fehler bei der Verbindung zum Server");
		}
		
		response.setRequestParameters(request.getParameters());
		response.setCallback(request.getCallback());
		
		return response;
	}

	@Override
    protected void onPostExecute(BaseServerResponse response) {
        if(response.getCallback() != null)
        {
        	response.getCallback().OnResponseReceived(response);
        }
    }
}
