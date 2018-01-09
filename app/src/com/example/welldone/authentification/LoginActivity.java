package com.example.welldone.authentification;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.HttpResponse;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
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
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.welldone.R;
import com.example.welldone.home.HomeActivity;
import com.example.welldone.server.ServerRequestHelper;
import com.example.welldone.server.model.BaseServerResponse;
import com.example.welldone.server.model.IServerResponseCallback;
import com.example.welldone.server.model.ServerRequest;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends Activity {

	private AutoCompleteTextView emailView;
	private EditText passwordView;
	private View focusView = null;

	private boolean cancel;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);

		emailView = (AutoCompleteTextView) findViewById(R.id.email);
		passwordView = (EditText) findViewById(R.id.password);

		passwordView.setOnEditorActionListener(new TextView.OnEditorActionListener() {
			@Override
			public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
				if (id == R.id.login || id == EditorInfo.IME_NULL) {
					attemptLogin();
					return true;
				}
				return false;
			}
		});

		// Login-Button
		// --------------
		Button signInButton = (Button) findViewById(R.id.email_sign_in_button);
		signInButton.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				attemptLogin();
			}
		});

		Button createAccountButton = (Button) findViewById(R.id.register_button);
		createAccountButton.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				Intent i = new Intent(LoginActivity.this, RegisterActivity.class);
				// Dummy Daten für Test-Registrierung
				Bundle extras = new Bundle();
				extras.putString("firstname1", "Dominik");
				extras.putString("lastname1", "Hattenberger");
				extras.putString("email1", "dom.hattenberger@hotmail.com");
				extras.putString("password1", "test123");
				i.putExtras(extras);
				startActivity(i);
			}
		});
	}

	/**
	 * Attempts to sign in specified by the login form. If there are form errors
	 * (invalid email, missing fields, etc.), the errors are presented and no
	 * actual login attempt is made.
	 */
	public void attemptLogin() {

		// Fehlermeldungen ausblenden
		emailView.setError(null);
		passwordView.setError(null);

		String email = emailView.getText().toString();
		String password = passwordView.getText().toString();

		cancel = false;
		focusView = null;

		// Check for a valid password
		if (TextUtils.isEmpty(password) || !isPasswordValid(password)) {
			passwordView.setError(getString(R.string.error_invalid_password));
			focusView = passwordView;
			cancel = true;
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
		// //Test-Abfrage (Dummy Daten)
		// Bundle item = getIntent().getExtras();
		// if(email.equals("dom.hattenberger@hotmail.com") &&
		// !password.equals("test123")){
		// passwordView.setError("Dieses Passwort ist nicht korrekt!");
		// focusView = passwordView;
		// cancel = true;
		// }
		//
		// if(email.equals(item.get("email2").toString()) &&
		// !password.equals(item.get("password2").toString()) &&
		// !email.equals("")){
		// passwordView.setError("Dieses Passwort ist nicht korrekt!");
		// focusView = passwordView;
		// cancel = true;
		// }

		ServerRequest request = new ServerRequest("user/login", new IServerResponseCallback() {

			@Override
			public BaseServerResponse CreateResponseFromJson(String json) {
				return BaseServerResponse.fromJson(json);
			}
			
			@Override
			public void OnResponseReceived(BaseServerResponse response) {
				if (!response.getSuccess()) {
					// ein Fehler ist aufgetreten! Die Registrierung wird
					// abgebrochen und der Fokus auf das Feld
					// gelegt wo die fehlerhafte Eingabe stattgefunden hat
					if (focusView != null) {
						focusView.requestFocus();
					}
				} else {
					Bundle extras = new Bundle();
					Intent intent = new Intent(LoginActivity.this, HomeActivity.class);

					extras.putString("email", (String)response.getRequestParameters().get("email"));
					extras.putString("password", (String)response.getRequestParameters().get("passwd"));
					intent.putExtras(extras);
					startActivity(intent);
				}
			}
		});

		request.addParameter("email", email);
		request.addParameter("passwd", password);

		new ServerRequestHelper().execute(request);
	}

	private boolean isEmailValid(String email) {
		boolean retValue = true;
		int i = email.indexOf("@");
		int j = email.indexOf(".", i);

		if (i == 0) {
			retValue = false;
		}
		if (j == -1) {
			retValue = false;
		}
		if (j == -1 || j == (email.length() - 1)) {
			retValue = false;
		}

		return retValue;
	}

	private boolean isPasswordValid(String password) {
		return password.length() > 4;
	}

	public static String GET(String url) {
		InputStream inputStream = null;
		String result = "";

		try {

			// create HttpClient
			HttpClient httpclient = new DefaultHttpClient();

			// make GET request to the given URL
			HttpResponse httpResponse = httpclient.execute(new HttpGet(url));

			// receive response as inputStream
			inputStream = httpResponse.getEntity().getContent();

			// convert inputstream to string
			if (inputStream != null)
				result = convertInputStreamToString(inputStream);
			else
				result = "Did not work!";

		} catch (Exception e) {
			Log.d("InputStream", e.getLocalizedMessage());
		}
		return result;
	}

	private static String convertInputStreamToString(InputStream inputStream) throws IOException {
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
		String line = "";
		String result = "";
		while ((line = bufferedReader.readLine()) != null)
			result += line;

		inputStream.close();
		return result;
	}

	private class HttpAsyncTask extends AsyncTask<String, Void, String> {
		@Override
		protected String doInBackground(String... urls) {

			return ""; // GET(urls[0]);
		}

		// onPostExecute displays the results of the AsyncTask.
		@Override
		protected void onPostExecute(String result) {
			String user = emailView.getText().toString();
			String pwd = passwordView.getText().toString();
			View focusView = null;

			try {

				JSONArray arr = new JSONArray(result);
				JSONObject obj;
				String _id, $id, name;

				for (int i = 0; i < arr.length(); i++) {
					focusView = null;
					emailView.setError(null);
					passwordView.setError(null);
					_id = arr.getJSONObject(i).getString("_id");
					obj = new JSONObject(_id);
					$id = obj.getString("$id");
					name = arr.getJSONObject(i).getString("name");

					if (user.startsWith(name) && $id.startsWith(pwd)) {
						Toast.makeText(getApplicationContext(), "Login successful!", Toast.LENGTH_LONG).show();
						Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
						startActivity(intent);
						i = arr.length();
					} else {
						if (user.startsWith(name) && !$id.startsWith(pwd)) {
							passwordView.setError(getString(R.string.error_incorrect_password));
							focusView = passwordView;
							i = arr.length();
						} else {
							focusView = emailView;
							if (!user.startsWith(name)) {
								emailView.setError("User does not exist!");
							}
							if (!$id.startsWith(pwd)) {
								passwordView.setError(getString(R.string.error_incorrect_password));
							}
						}
					}
				}
				if (focusView != null) {
					focusView.requestFocus();
					Toast.makeText(getApplicationContext(), "Login failed!", Toast.LENGTH_LONG).show();
				}

			} catch (JSONException e) {
				e.getMessage();
			}
		}
	}

	public class HttpPostTask extends AsyncTask<String, Void, String> {
		@Override
		protected String doInBackground(String... params) {
			String user = emailView.getText().toString();
			String pwd = passwordView.getText().toString();

			String result = "fail";
			try {
				JSONObject newObj1 = new JSONObject();

				newObj1.put("mail", user);
				newObj1.put("password", pwd);
				HttpClient httpClient = new DefaultHttpClient();
				HttpPost postRequest = new HttpPost("http://192.168.1.7:8081/user/login");
				StringEntity input = new StringEntity(newObj1.toString());
				input.setContentType("application/json;charset=UTF-8");
				postRequest.setEntity(input);
				input.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json;charset=UTF-8"));
				postRequest.setHeader("Accept", "application/json");
				postRequest.setEntity(input);
				HttpResponse response = httpClient.execute(postRequest);

				BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
				String output;

				while ((output = br.readLine()) != null) {
					result = output;
				}

				if (!result.equals("}")) {
					Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
					Bundle extras = new Bundle();

					extras.putString("author", user);
					extras.putString("token", result);
					intent.putExtras(extras);
					startActivity(intent);
					result = "Login successful!";

				} else {
					result = "Login failed!";
				}

				httpClient.getConnectionManager().shutdown();

			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} catch (JSONException e) {
				e.printStackTrace();
			}
			return result;
		}

		protected void onPostExecute(String page) {
			Toast.makeText(getApplicationContext(), page, Toast.LENGTH_LONG).show();

			// Toast toast = Toast.makeText(getApplicationContext(), page,
			// Toast.LENGTH_SHORT);
			// toast.show();
		}
	}
}