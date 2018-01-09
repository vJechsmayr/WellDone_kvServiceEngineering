package com.example.welldone.authentification;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.welldone.R;
import com.example.welldone.R.string;

/**
 * A login screen that offers login via email/password.
 */
public class RegisterActivity extends Activity {
	
	private AutoCompleteTextView firstnameView;
	private AutoCompleteTextView lastnameView;
	private AutoCompleteTextView emailView;
	private EditText passwordView;
	private EditText passwordView2;
	
	private View focusView = null;
	private boolean cancel;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_register);
		
		firstnameView = (AutoCompleteTextView) findViewById(R.id.firstname_register);
		lastnameView = (AutoCompleteTextView) findViewById(R.id.lastname_register);
		emailView = (AutoCompleteTextView) findViewById(R.id.email_register);
		passwordView = (EditText) findViewById(R.id.password_register);
		passwordView2 = (EditText) findViewById(R.id.password_wh_register);
		
		passwordView2.setOnEditorActionListener(new TextView.OnEditorActionListener() {
			@Override
			public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
				if (id == R.id.login || id == EditorInfo.IME_NULL) {
					attemptRegistration();
					return true;
				}
				return false;
			}
		});
		
		//Registrierungs-Button
		//--------------
		Button registerButton = (Button) findViewById(R.id.button_register);
		registerButton.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				attemptRegistration();
			}
		});
	}
	
	public void attemptRegistration() {
		Bundle item = getIntent().getExtras();

		// Fehlermeldungen ausblenden
		firstnameView.setError(null);
		lastnameView.setError(null);
		emailView.setError(null);
		passwordView.setError(null);
		passwordView2.setError(null);

		String firstname = firstnameView.getText().toString();
		String lastname = lastnameView.getText().toString();
		String email = emailView.getText().toString();
		String password = passwordView.getText().toString();
		String password2 = passwordView2.getText().toString();
		
		
		
		cancel = false;
		focusView = null;
		
		// Check for a valid password
		if (TextUtils.isEmpty(password) || !isPasswordValid(password)) {
			passwordView.setError(getString(R.string.error_invalid_password));
			focusView = passwordView;
			cancel = true;
		}else{
			if(!password.equals(password2)){
				passwordView2.setError(getString(R.string.error_passwords_not_identical));
				focusView = passwordView2;
				cancel = true;
			}
		}
		
		// Check for a valid email address.
		if (TextUtils.isEmpty(email)) {
			emailView.setError(getString(R.string.error_field_required));
			focusView = emailView;
			cancel = true;
		} else if (!isEmailValid(email)) {
			emailView.setError(getString(R.string.error_invalid_email));
			focusView = emailView;
			cancel = true;
		}
		
		// Check for a valid lastname
		if (TextUtils.isEmpty(lastname)) {
			lastnameView.setError(getString(R.string.error_field_required));
			focusView = lastnameView;
			cancel = true;
		} else if (!isNameValid(lastname, lastnameView)) {
			focusView = lastnameView;
			cancel = true;
		}
		
		// Check for a valid firstname
		if (TextUtils.isEmpty(firstname)) {
			firstnameView.setError(getString(R.string.error_field_required));
			focusView = firstnameView;
			cancel = true;
		} else if (!isNameValid(firstname, firstnameView)) {
			focusView = firstnameView;
			cancel = true;
		}
		//Test-Abfrage (Dummy Daten)
		if(email.equals(item.get("email1").toString()) || (email.equals(item.get("email1").toString()) && !email.equals(""))){
			emailView.setError(getString(R.string.error_email_already_exists));
			focusView = emailView;
			cancel = true;
		}
		
		if (cancel) {
			// ein Fehler ist aufgetreten! Die Registrierung wird abgebrochen und der Fokus auf das Feld
			// gelegt wo die fehlerhafte Eingabe stattgefunden hat
			focusView.requestFocus();
		} else {		
			new HttpGetUsers().execute("http://192.168.1.7:8081/users/get");   
		}
	}

	private boolean isNameValid(String name, AutoCompleteTextView view){
		for(int i = 0; i < name.length(); i++){
			if(!Character.isLetter(name.charAt(i)) && !Character.isWhitespace(name.charAt(i)) && !(name.charAt(i) == '-')){
				view.setError("Dieser Name ist ungültig!");
				return false;
			} else if(i == 0 && !(Character.isLetter(name.charAt(i)) && Character.isUpperCase(name.charAt(i)))){
				view.setError("Das erste Zeichen ist kein Großbuchstabe!");
				return false;
			} else if(i > 0 && (Character.isWhitespace(name.charAt(i)) || name.charAt(i) == '-')
					        && (Character.isWhitespace(name.charAt(i-1)) || name.charAt(i) == '-')){
				view.setError("Dieser Name ist ungültig!");
				return false;
			}
		}
		return true;
	}
	
	private boolean isEmailValid(String email) {
		boolean retValue = true;
		int i = email.indexOf("@");
		int j = email.indexOf(".", i);
		    
		if (i == 0){ retValue = false; }
		if (j == -1){ retValue = false; }
		if (j == -1 || j == (email.length()-1) ) { retValue = false; }
		
		return retValue;
	}

	private boolean isPasswordValid(String password) {
		return password.length() > 4;
	}
	
	public static String GET(String url){
        InputStream inputStream = null;
        String result = "";
        try {
 
            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse httpResponse = httpclient.execute(new HttpGet(url));
            inputStream = httpResponse.getEntity().getContent();
            if(inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";
 
        } catch (Exception e) {
            Log.d("InputStream", e.getLocalizedMessage());
        } 
        return result;
    }
 
    private static String convertInputStreamToString(InputStream inputStream) throws IOException{
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;
 
        inputStream.close();
        return result;
    }
	
	private class HttpGetUsers extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
 
            return GET(urls[0]);
        }

        @Override
        protected void onPostExecute(String result) {
        	String firstname = firstnameView.getText().toString();
        	String lastname = lastnameView.getText().toString();
        	String user = emailView.getText().toString();
        	String pwd = passwordView.getText().toString();
        	String pwd2 = passwordView2.getText().toString();
        	View focusView = null;
         
            try { 
            	JSONObject obj = new JSONObject(result);
            	JSONArray data = new JSONArray(obj.getString("data"));
            	String first, last, email, password;
            	
            	for(int i = 0; i < data.length(); i++){
            		focusView = null;
            		emailView.setError(null);
            		passwordView.setError(null);
            		passwordView2.setError(null);

            		first = data.getJSONObject(i).getString("firstname");
            		last = data.getJSONObject(i).getString("lastname");
            		email = data.getJSONObject(i).getString("email");
            		
            		if(user.equals(email)){
            			emailView.setError(getString(string.error_email_already_exists));
            			focusView = emailView;
    		            i = data.length();
    				}
            	}
            } catch (JSONException e) {
				e.printStackTrace();
			}
            if(focusView != emailView){
            		
            	JSONObject newUser = new JSONObject();
	            try {
					newUser.put("firstname", firstname);
					newUser.put("lastname", lastname);
					newUser.put("email", user);
					newUser.put("password", pwd);
					newUser.put("password2", pwd);
				} catch (JSONException e) {
					e.printStackTrace();
				}
				new HttpRegisterUser(newUser).execute("http://192.168.1.7:8081/user/register");
				
					
            }else{
            	if(focusView != null){
            		focusView.requestFocus();
            	}
            }
        }
    }
	
	private class HttpRegisterUser extends AsyncTask<String, Void, String> {       

		private JSONObject user;
		
        protected HttpRegisterUser(JSONObject user){
        	this.user = user;
        }
		
		@Override
        protected String doInBackground(String... params)  {           
            String result_id = "fail";
            try {
            	HttpClient httpClient = new DefaultHttpClient();
            	HttpPost postRequest = new HttpPost("http://192.168.1.7:8081/user/register");
            	StringEntity input = new StringEntity(user.toString());
            	input.setContentType("application/json;charset=UTF-8");
            	postRequest.setEntity(input);
            	input.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
            	postRequest.setHeader("Accept", "application/json");
            	postRequest.setEntity(input);

            	HttpResponse response = httpClient.execute(postRequest);

            	BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
            	String output;
            	result_id = "";
            	while ((output = br.readLine()) != null) {
            		result_id = result_id + output;
            	}
            	JSONObject $id = new JSONObject(result_id);
        		result_id = $id.getString("$id");
            	httpClient.getConnectionManager().shutdown();

            } catch (MalformedURLException e) {
            	e.printStackTrace();
            } catch (IOException e) {
            	e.printStackTrace();
            } catch (JSONException e) {
				e.printStackTrace();
			}
            return  result_id;
        }

        protected void onPostExecute(String result){  
        	firstnameView = (AutoCompleteTextView) findViewById(R.id.firstname_register);
    		lastnameView = (AutoCompleteTextView) findViewById(R.id.lastname_register);
    		emailView = (AutoCompleteTextView) findViewById(R.id.email_register);
    		passwordView = (EditText) findViewById(R.id.password_register);
//            if(!result.equals("fail")){
//            	Intent i = new Intent(RegisterActivity.this, LoginActivity.class);
//            	startActivity(i);
//            	Toast.makeText(getBaseContext(), "User successfully registered!", Toast.LENGTH_LONG).show();
//            }else{
            	//Toast.makeText(getBaseContext(), "Registration failed!", Toast.LENGTH_LONG).show();
            	
    		Intent i = new Intent(RegisterActivity.this, LoginActivity.class);
            	
            //Dummy Daten für Registrierungs-Test
            Bundle extras = new Bundle();
    		extras.putString("firstname2", firstnameView.getText().toString());
    		extras.putString("lastname2", lastnameView.getText().toString());
    		extras.putString("email2", emailView.getText().toString());
    		extras.putString("password2", passwordView.getText().toString());
    		i.putExtras(extras);
    		startActivity(i);
        }   
    }
}