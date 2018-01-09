package com.example.welldone.user;
 
import com.example.welldone.R;
import com.example.welldone.home.HomeActivity;
 
import android.support.v7.app.ActionBarActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

 
public class NewUserActivity extends ActionBarActivity {
	
	protected static final int GET_FROM_GALLERY = 3;

	protected static final int REQUEST_CODE = 1;

	private int curView = 2;
     
    android.app.ActionBar actionBar;
 
    @Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_new_user);
	
		Button save = (Button) findViewById(R.id.newuser_button_save);
		save.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				Intent i = new Intent(NewUserActivity.this, HomeActivity.class);
	            startActivity(i);		
	            finish();
	        }
		});
    }

	public void onButtonClick(int fontsize, String text) {
    }
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.newuser, menu);
		return true;
	}
 
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
         
        int id = item.getItemId();
        if (id == R.id.action_cancel) {
        	this.finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}