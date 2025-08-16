import React, { useState } from 'react';
import { Button } from './Button';

export const ButtonDemo: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Variants Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={handleClick}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={handleClick}>
            Secondary Button
          </Button>
          <Button variant="ghost" onClick={handleClick}>
            Ghost Button
          </Button>
        </div>
      </div>

      {/* Sizes Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm" onClick={handleClick}>
            Small Button
          </Button>
          <Button size="md" onClick={handleClick}>
            Medium Button
          </Button>
        </div>
      </div>

      {/* Variants + Sizes Combination */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants with Different Sizes</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm" onClick={handleClick}>
              Primary Small
            </Button>
            <Button variant="primary" size="md" onClick={handleClick}>
              Primary Medium
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" size="sm" onClick={handleClick}>
              Secondary Small
            </Button>
            <Button variant="secondary" size="md" onClick={handleClick}>
              Secondary Medium
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleClick}>
              Ghost Small
            </Button>
            <Button variant="ghost" size="md" onClick={handleClick}>
              Ghost Medium
            </Button>
          </div>
        </div>
      </div>

      {/* States Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleClick}>
            Normal Button
          </Button>
          <Button disabled>
            Disabled Button
          </Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
        </div>
      </div>

      {/* Types Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Types</h3>
        <div className="flex flex-wrap gap-4">
          <Button type="button" onClick={handleClick}>
            Button Type
          </Button>
          <Button type="submit" onClick={handleClick}>
            Submit Type
          </Button>
          <Button type="reset" onClick={handleClick}>
            Reset Type
          </Button>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Interactive Demo</h3>
        <p className="text-blue-800 mb-4">
          Click any button above to see the counter increase. Current count: <strong>{clickCount}</strong>
        </p>
        <Button variant="primary" onClick={() => setClickCount(0)}>
          Reset Counter
        </Button>
      </div>
    </div>
  );
};

export default ButtonDemo; 