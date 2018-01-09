package com.example.welldone.user;

import com.example.welldone.R;
import com.example.welldone.home.HomeActivity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar.OnNavigationListener;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.MultiAutoCompleteTextView;
import android.widget.Spinner;


public class NewUserFragment extends Fragment {

	protected static final int REQUEST_CODE = 0;
    protected MultiAutoCompleteTextView mail;
    protected MultiAutoCompleteTextView firstname;
    protected MultiAutoCompleteTextView lastname;
    protected Spinner admin;
    protected Spinner active;
    protected EditText new_pwd;
    protected EditText new_pwd_wh;
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
            
    	View view =  inflater.inflate(R.layout.fragment_new_user, container, false);
	    Bundle bundle = getActivity().getIntent().getExtras();
	    if(bundle.getString("action").equals("edit")){
	    	
	    	mail = (MultiAutoCompleteTextView) view.findViewById(R.id.newuser_mail); 
	    	mail.setText(bundle.getString("mail"));
	    	
	    	firstname = (MultiAutoCompleteTextView) view.findViewById(R.id.newuser_firstname); 
	    	firstname.setText(bundle.getString("firstname"));
	    	
	    	lastname = (MultiAutoCompleteTextView) view.findViewById(R.id.newuser_lastname); 
	    	lastname.setText(bundle.getString("lastname"));
	    	
	    	admin = (Spinner) view.findViewById(R.id.spinner_admin);
	    	if(bundle.getBoolean("admin") == true){
	    		admin.setSelection(0);
	    	}else{
	    		admin.setSelection(1);
	    	}
	    	
	    	active = (Spinner) view.findViewById(R.id.spinner_active);
	    	if(bundle.getBoolean("active") == true){
	    		active.setSelection(0);
	    	}else{
	    		active.setSelection(1);
	    	}
	    	
	    	new_pwd = (EditText) view.findViewById(R.id.newuser_pwd); 
	    	new_pwd.setText(bundle.getString("pwd"));
	    	
	    	new_pwd_wh = (EditText) view.findViewById(R.id.newuser_pwd_wh); 
	    	new_pwd_wh.setText(bundle.getString("pwd"));	
	    }
	            
	    Button button = (Button) view.findViewById(R.id.newuser_button_save);
	    button.setOnClickListener(new OnClickListener() {
	    	@Override
	    	public void onClick(View view) {			
	    		Intent i = new Intent(getActivity(), HomeActivity.class);
	    		startActivity(i);
	    		getActivity().finish();
	    	}
		});
	    return view;
    }

	@Override
	public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
		super.onCreateOptionsMenu(menu, inflater);
	}	
}