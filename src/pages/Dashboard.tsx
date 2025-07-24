
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen pt-20">
        {/* Place your dashboard components here */}
        <div className="rounded-xl bg-black/60 p-10 shadow-xl border border-barrush-steel/30 text-barrush-platinum w-full mt-12">
          <h1 className="text-4xl font-bold font-serif mb-6 text-rose-600">Dashboard</h1>
          {/* TODO: Replace this placeholder with dashboard content */}
          <div className="text-barrush-platinum/80">
            Dashboard content goes here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
