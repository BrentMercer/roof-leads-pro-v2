<form className="mt-6 space-y-6">
  <div className="debug-theme">
    Theme Debug: This should change color with theme
  </div>
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-foreground">
      Email address
    </label>
    <div className="mt-1">
      <input
        id="email"
        className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm bg-background"
        type="email"
        name="email"
      />
    </div>
  </div>
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-foreground">
      Password
    </label>
    <div className="mt-1">
      <input
        id="password"
        className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm bg-background"
        type="password"
        name="password"
      />
    </div>
  </div>
  <div>
    <button
      type="submit"
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
    >
      Sign in
    </button>
  </div>
</form> 