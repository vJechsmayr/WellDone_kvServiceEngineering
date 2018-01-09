package com.example.welldone.home;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import com.example.welldone.R;
import com.example.welldone.model.*;
import com.example.welldone.project.NewProjectActivity;
import com.example.welldone.server.ServerRequestHelper;
import com.example.welldone.server.model.BaseServerResponse;
import com.example.welldone.server.model.IServerResponseCallback;
import com.example.welldone.server.model.ProjectListResponse;
import com.example.welldone.server.model.ProjectListResponseItem;
import com.example.welldone.server.model.ServerRequest;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.ListFragment;
import android.support.v7.app.ActionBar.OnNavigationListener;
import android.text.format.DateFormat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;


public class ProjectviewFragment extends ListFragment {
	
	private List<ProjectviewItem> projectviewItems = new ArrayList<ProjectviewItem>();	
	
	public ProjectviewFragment(){
	}
	
	@Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		return inflater.inflate(R.layout.fragment_projectview, container, false);
    }
	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);
		
		ServerRequest request = new ServerRequest("projects/get", new IServerResponseCallback() {
			
			@Override
			public void OnResponseReceived(BaseServerResponse response) {
				
				if(response.getSuccess())
				{	
					for(ProjectListResponseItem item : ((ProjectListResponse)response).getData()){
						projectviewItems.add(new ProjectviewItem(item.getTitle(), item.getOwnerfirstname() + " " + item.getOwnerlastname(), item.getStatus(), "01.04.2016", "01.05.2016", item.getType()));
					}
					
					populateListView();
				}
			}
			
			@Override
			public BaseServerResponse CreateResponseFromJson(String json) {
				return ProjectListResponse.fromJson(json);
			}
		});
		
		request.addParameter("showuserprojects", false);
		
		new ServerRequestHelper().execute(request);
		
		//populatePostList();
		//populateListView();
	}
	//Test-Daten
	private void populatePostList() {
		projectviewItems.clear();
		
		projectviewItems.add(new ProjectviewItem("WellDone Entwicklung 1", "Viktoria Jechsmayr", "Abgeschlossen", "01.04.2016", "01.05.2016", "internes Projekt"));
		projectviewItems.add(new ProjectviewItem("WellDone Entwicklung 2", "Michael Lehner", "in Umsetzung", "01.04.2016", "01.07.2016", "Kundenprojekt"));
		projectviewItems.add(new ProjectviewItem("WellDone Entwicklung 3", "Dominik Hattenberger", "in Planung", "01.04.2016", "01.06.2016", "internes Projekt"));
		projectviewItems.add(new ProjectviewItem("Dokumentation", "Viktoria Jechsmayr", "Abnahme", "01.04.2016", "05.09.2016", "Kundenprojekt"));
	}
	
	private void populateListView() {
		ArrayAdapter<ProjectviewItem> adapter = new MyListAdapter();
		setListAdapter(adapter);
	}
	
	@Override
	 public void onListItemClick(ListView l, View v, int position, long id) {
	} 
	
	private class MyListAdapter extends ArrayAdapter<ProjectviewItem> {
		public MyListAdapter() {
			super(getActivity(), R.layout.fragment_projectview_item, projectviewItems);
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			View itemView = convertView;
			if (itemView == null) {
				LayoutInflater mInflater = (LayoutInflater) getContext().getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
	            itemView = mInflater.inflate(R.layout.fragment_projectview_item, null);
	        }
			
			ProjectviewItem currentItem = projectviewItems.get(position);
						
			TextView project = (TextView) itemView.findViewById(R.id.item_project);
			project.setText(currentItem.getTitle());

			TextView owner = (TextView) itemView.findViewById(R.id.item_owner_name);
			owner.setText("" + currentItem.getOwner());
			
			TextView status = (TextView) itemView.findViewById(R.id.item_status_name);
			status.setText(currentItem.getStatus());
			
			TextView startDate = (TextView) itemView.findViewById(R.id.item_startDate_day);
			startDate.setText(currentItem.getStartDate());
			
			TextView endDate = (TextView) itemView.findViewById(R.id.item_endDate_day);
			endDate.setText(currentItem.getEndDate());
			
			Button edit = (Button) itemView.findViewById(R.id.item_button_edit);
			edit.setTag(currentItem);
			edit.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View view) {
					Intent i = new Intent(getActivity(), NewProjectActivity.class);
					Bundle extras = new Bundle();					
					ProjectviewItem item = (ProjectviewItem)((Button) view.findViewById(R.id.item_button_edit)).getTag();
					extras.putString("action", "edit");
					extras.putString("title", item.getTitle());
					extras.putString("type", item.getType());
					extras.putString("owner", item.getOwner());
					extras.putString("status", item.getStatus());
					extras.putString("startDate", item.getStartDate());
					extras.putString("endDate", item.getEndDate());
					i.putExtras(extras);
					
		            startActivity(i);
				}
			});

			return itemView;
		}				
	}
}