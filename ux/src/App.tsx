import React, { useState } from 'react';
import { State, StateOption } from './interfaces/GridDataInterfaces';
import { US_STATES } from './constants';
import { generateMockStateData } from './helpers.js/mockGenerator';
import { GroupedGrid } from './components/GroupedGrid';
import { useNotification } from './hooks/useNotification';
import { Notifications } from './components/Notifications';
import { SearchStateBar } from './components/Searchbar';

const App: React.FC = () => {
  
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<State | null>(null);

  const handleSuccess = () => {
    showNotification('State Data Retrieved!', 'success');
  };

  const handleStateSelect = async (state: StateOption) => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      handleSuccess();
      const mockData = generateMockStateData(state);
      setStateData(mockData);
      setLoading(false);
            
    } catch (error) {
      setLoading(false);
      console.error('Error generating state data:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nacelle Screen</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>Christian Rappa</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <section className="mb-8">
          <SearchStateBar states={US_STATES} onStateSelect={handleStateSelect}/>
        </section>

        {/* Data Grid Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">State Data</h2>
          <div className="border border-gray-200 rounded-lg p-4 min-h-[400px]" style={{ height: 300, width: '100%' }}>
            <GroupedGrid stateData={stateData} loading={loading} />
            <Notifications />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto">
          <div className="flex justify-center items-center">
            <div>
              <p>&copy; 2025 Nacelle Tech Screen</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
