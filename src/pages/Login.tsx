import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col flex-1 min-h-screen justify-center pt-32 pb-20">
        {/* Place your login form/component here */}
        <div className="rounded-xl bg-black/70 p-8 shadow-xl border border-barrush-steel/30 text-barrush-platinum w-full">
          <h1 className="text-4xl font-bold font-serif mb-6 text-center text-rose-600">Login</h1>
          {/* TODO: Replace this placeholder with actual login form */}
          <div className="text-center text-barrush-platinum/80">
            Login form goes here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
