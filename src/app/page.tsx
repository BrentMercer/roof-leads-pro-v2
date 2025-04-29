import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Roof Leads Pro
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your all-in-one solution for identifying and connecting with homeowners in need of new roofs.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/signin"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">MLS Data Integration</h3>
            <p className="mt-2 text-gray-500">
              Automatically sync with MLS data to identify properties with aging roofs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Lead Management</h3>
            <p className="mt-2 text-gray-500">
              Track and manage leads efficiently with our intuitive dashboard.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Client Portal</h3>
            <p className="mt-2 text-gray-500">
              Share leads with your clients through a secure, dedicated portal.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 