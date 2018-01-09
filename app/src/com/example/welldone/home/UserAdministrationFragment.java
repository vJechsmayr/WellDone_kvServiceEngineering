package com.example.welldone.home;

import java.util.ArrayList;
import java.util.List;

import com.example.welldone.R;
import com.example.welldone.model.*;
import com.example.welldone.user.NewUserActivity;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.ListFragment;
import android.support.v7.app.ActionBar.OnNavigationListener;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;


public class UserAdministrationFragment extends ListFragment {
	
	private List<UserItem> userItems = new ArrayList<UserItem>();	
		
	@Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		return inflater.inflate(R.layout.fragment_user_administration, container, false);
    }
	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);
		
		populatePostList();
		populateListView();
		
	}
	
	public UserAdministrationFragment(){
	}
	//Test-Daten
	private void populatePostList() {
		userItems.clear();
		
		userItems.add(new UserItem("Viktoria", "Jechsmayr", "viktoria@jechsmayr.at", "viktoria", true, true));
		userItems.add(new UserItem("Michael", "Lehner", "michael@lehner.at", "michael", true, true));
		userItems.add(new UserItem("Dominik", "Hattenberger", "dominik@hattenberger.at", "dominik", false, true));
		userItems.add(new UserItem("Max", "Mustermann", "max@mustermann.at", "max123", false, false));

	}
	
	private void populateListView() {
		ArrayAdapter<UserItem> adapter = new MyListAdapter();
		setListAdapter(adapter);
	}
	
	@Override
	 public void onListItemClick(ListView l, View v, int position, long id) {
	} 
	
	private class MyListAdapter extends ArrayAdapter<UserItem> {
		public MyListAdapter() {
			super(getActivity(), R.layout.fragment_user_administration_item, userItems);
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			View itemView = convertView;
			if (itemView == null) {
				LayoutInflater mInflater = (LayoutInflater) getContext().getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
	            itemView = mInflater.inflate(R.layout.fragment_user_administration_item, null);
	        }
			
			UserItem currentItem = userItems.get(position);
						
			TextView user = (TextView) itemView.findViewById(R.id.item_user);
			user.setText(currentItem.getFirstname() + " " +currentItem.getLastname());

			TextView mail = (TextView) itemView.findViewById(R.id.item_mail_name);
			mail.setText("" + currentItem.getMail());
			
			Button edit = (Button) itemView.findViewById(R.id.item_button_edit_user);
			edit.setTag(currentItem);
			edit.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View view) {
					Intent i = new Intent(getActivity(), NewUserActivity.class);
					Bundle extras = new Bundle();					
					UserItem item = (UserItem)((Button) view.findViewById(R.id.item_button_edit_user)).getTag();
					extras.putString("action", "edit");
					extras.putString("mail", item.getMail());
					extras.putString("firstname", item.getFirstname());
					extras.putString("lastname", item.getLastname());
					extras.putBoolean("admin", item.isAdmin());
					extras.putBoolean("active", item.isActive());
					extras.putString("pwd", item.getPassword());
					i.putExtras(extras);
		            startActivity(i);
				}
			});

			return itemView;
		}				
	}
}