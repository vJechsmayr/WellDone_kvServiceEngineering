package com.example.welldone.project;

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
import android.widget.MultiAutoCompleteTextView;
import android.widget.Spinner;


public class NewProjectFragment extends Fragment {

	protected static final int REQUEST_CODE = 0;
    protected MultiAutoCompleteTextView title;
    protected MultiAutoCompleteTextView startDate;
    protected MultiAutoCompleteTextView endDate;
    protected Spinner type;
    protected Spinner owner;
    protected Spinner status;
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
            
    	View view =  inflater.inflate(R.layout.fragment_new_project, container, false);
	    Bundle bundle = getActivity().getIntent().getExtras();
	    if(bundle.getString("action").equals("edit")){
	    	
	    	title = (MultiAutoCompleteTextView) view.findViewById(R.id.newproject_title); 
	    	title.setText(bundle.getString("title"));
	    	
	    	type = (Spinner) view.findViewById(R.id.spinner_type);
	    	if(bundle.getString("type").equals("internes Projekt")){
	    		type.setSelection(0);
	    	}else{
	    		if(bundle.getString("type").equals("Kundenprojekt")){
	    			type.setSelection(1);
	    		}else{
	    			type.setSelection(0);
	    		}
	    	}
	    	
	    	owner = (Spinner) view.findViewById(R.id.spinner_owner);
	    	if(bundle.getString("owner").equals("Viktoria Jechsmayr")){
	    		owner.setSelection(0);
	    	}else{
	    		if(bundle.getString("owner").equals("Michael Lehner")){
	    			owner.setSelection(1);
	    		}else{
	    			if(bundle.getString("owner").equals("Dominik Hattenberger")){
		    			owner.setSelection(2);
	    			}else{
	    				owner.setSelection(0);
	    			}
	    		}
	    	}
	    	
	    	status = (Spinner) view.findViewById(R.id.spinner_status);
		    if(bundle.getString("status").equals("Abgebrochen")){status.setSelection(0);}
		    if(bundle.getString("status").equals("Abgeschlossen")){status.setSelection(1);}
		    if(bundle.getString("status").equals("Abnahme")){status.setSelection(2);}
		    if(bundle.getString("status").equals("Freigabe")){status.setSelection(3);}		    
		    if(bundle.getString("status").equals("in Planung")){status.setSelection(4);}	
		    if(bundle.getString("status").equals("in Umsetzung")){status.setSelection(5);}
		    
		    startDate = (MultiAutoCompleteTextView) view.findViewById(R.id.newproject_startDate); 
	    	startDate.setText(bundle.getString("startDate"));
	    	
	    	endDate = (MultiAutoCompleteTextView) view.findViewById(R.id.newproject_endDate); 
	    	endDate.setText(bundle.getString("endDate"));	    	
	    }
	            
	    Button button = (Button) view.findViewById(R.id.newproject_button_publish);
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