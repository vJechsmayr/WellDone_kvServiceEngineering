package com.example.welldone.home;
  
import com.example.welldone.R;
import com.example.welldone.authentification.LoginActivity;
import com.example.welldone.project.NewProjectActivity;
import com.example.welldone.user.NewUserActivity;
 
import android.support.v7.app.ActionBar.OnNavigationListener;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.content.Intent;
import android.content.res.TypedArray;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.support.v4.widget.DrawerLayout;
import android.widget.AdapterView;

 
public class HomeActivity extends ActionBarActivity
        implements NavigationDrawerFragment.NavigationDrawerCallbacks, OnNavigationListener {
 	
	private int curView = 1;
     
    ActionBar actionBar;
    String[] menutitles; 
    TypedArray menuIcons;
    private NavigationDrawerFragment mNavigationDrawerFragment;
    private CharSequence mTitle;
 
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
         
        mNavigationDrawerFragment = (NavigationDrawerFragment) getSupportFragmentManager().findFragmentById(R.id.navigation_drawer);
        mTitle = getTitle();
        // Set up the drawer.
        mNavigationDrawerFragment.setUp(R.id.navigation_drawer, (DrawerLayout) findViewById(R.id.drawer_layout));
    }
 
    @Override
    public void onNavigationDrawerItemSelected(int position) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        fragmentManager.beginTransaction().replace(R.id.container, displayView(position)).commit();
    }
 
    public void onSectionAttached(int number) {
        switch (number) {
            case 1:
                mTitle = getResources().getString(R.string.title_projects);
                break;
//            case 2:
//                mTitle = getResources().getString(R.string.title_tasks);
//                break;
//            case 3:
//                mTitle = getResources().getString(R.string.title_milestones);
//                break;
//            case 4:
//                mTitle = getResources().getString(R.string.title_tickets);
//                break;
//            case 5:
//                mTitle = getResources().getString(R.string.title_time_recordings);
//                break;
            case 2:
                mTitle = getResources().getString(R.string.title_user_administration);
                break;
        }
    }
     
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        displayView(position);
    }
 
    private Fragment displayView(int position) {
        Fragment f = null;

        switch (position) {
        case 0:
            f = new ProjectviewFragment();
            curView = 0;
            actionBar = getSupportActionBar();
 
            // Hide the action bar title
            actionBar.setDisplayShowTitleEnabled(false);
 
            // Enabling Spinner dropdown navigation
            actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_LIST);     
            break;
        case 1:
        	f = new UserAdministrationFragment();
            curView = 2;
            actionBar = getSupportActionBar();
            
            // Hide the action bar title
            actionBar.setDisplayShowTitleEnabled(false);
            break;
      
        }
        return f;
    }
 
    public void restoreActionBar() {
        ActionBar actionBar = getSupportActionBar();
        if(curView == 0){
            actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_LIST);
        }else{
        	if(curView == 1){
        		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
        	}else{
        		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        	}
        }
        actionBar.setDisplayShowTitleEnabled(false);
         
    }
 
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        if (!mNavigationDrawerFragment.isDrawerOpen()) {
        	if(curView == 0){
        		getMenuInflater().inflate(R.menu.projects, menu);
        	}else{
        		getMenuInflater().inflate(R.menu.user, menu);
        	}
            restoreActionBar();
            return true;
        }
        return super.onCreateOptionsMenu(menu);
    }
 
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
         
        int id = item.getItemId();
        if (id == R.id.action_logout) {
            Intent i = new Intent(HomeActivity.this, LoginActivity.class);
            startActivity(i);
            return true;
        }
        if (id == R.id.action_newProject) {
            Intent i = new Intent(HomeActivity.this, NewProjectActivity.class);
            
            Bundle extras = new Bundle();					
			extras.putString("action", "new");
			i.putExtras(extras);
            
            startActivity(i);
            return true;
        }
        if (id == R.id.action_newUser) {
            Intent i = new Intent(HomeActivity.this, NewUserActivity.class);
            
            Bundle extras = new Bundle();					
			extras.putString("action", "new");
			i.putExtras(extras);
            
            startActivity(i);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
 
    @Override
    public boolean onNavigationItemSelected(int position, long itemId) {
    	return onNavigationItemSelected(position, itemId);
    }
}