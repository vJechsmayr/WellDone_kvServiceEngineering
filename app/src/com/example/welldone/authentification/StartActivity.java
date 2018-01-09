package com.example.welldone.authentification;

import com.example.welldone.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;


public class StartActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_start);
		
		int DELAY = 5000;
	    Handler handler = new Handler();
	    handler.postDelayed(new Runnable() {            
	        @Override
	        public void run() {
	            Intent intent = new Intent(StartActivity.this, LoginActivity.class);
	            //Dummy Daten für Login-Test
	            Bundle extras = new Bundle();
	            extras.putString("firstname2", "1");
				extras.putString("lastname2", "1");
				extras.putString("email2", "1");
				extras.putString("password2", "1");
				intent.putExtras(extras);
				startActivity(intent);
	        }
	    }, DELAY);
	}
}
