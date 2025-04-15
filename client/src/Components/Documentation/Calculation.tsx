const Calculation = () => {
  return (
    <main className="p-10 w-full flex justify-center overflow-x-auto">
      <div className="flex flex-col items-center">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-6">
            Level Calculation Documentation
          </h1>
          <p className="text-lg mb-4">
            The CalculateLevel function calculates the user's level based on
            their experience points and triggers a level up if necessary.
          </p>
          <h2 className="text-xl font-semibold mb-2">Function Signature</h2>
          <pre className="bg-gray-200 p-4 rounded-lg mb-4 w-min">
            <code className="text-sm ">
              CalculateLevel(currentLVL: number, currentEXP: number, userId:
              number): void
            </code>
          </pre>
          <h2 className="text-xl font-semibold mb-2">Levels:</h2>
          <p className="text-lg mb-2">
            Levels determined by the the sum of the squares of each level.
          </p>
          <pre className="bg-gray-200 p-4 rounded-lg mb-4 w-min">
            <code className="text-sm">levels = Math.pow(level, 2)</code>
          </pre>
          <h2 className="text-xl font-semibold mb-2">Parameters</h2>
          <p className="text-lg mb-2">
            <strong>currentLVL:</strong> The current level of the user (a
            number).
          </p>
          <p className="text-lg mb-2">
            <strong>currentEXP:</strong> The current experience points of the
            user (a number).
          </p>
          <p className="text-lg mb-2">
            <strong>userId:</strong> The ID of the user (a number).
          </p>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-lg mb-6">
            This function takes the current level, current experience points,
            and user ID as input parameters. It calculates the user's level
            based on their experience points and triggers a level up if the
            user's experience points meet the requirements for the next level.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Calculation;
