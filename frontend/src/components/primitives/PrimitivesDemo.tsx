import React, { useState } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';

export const PrimitivesDemo: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<'success' | 'warning' | 'danger' | 'muted'>('success');
  const [buttonClicks, setButtonClicks] = useState(0);

  const handleButtonClick = () => {
    setButtonClicks(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Primitive Components</h1>
        <p className="text-lg text-gray-600">
          Small, reusable components used across the application
        </p>
      </div>

      {/* Button Component Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Button Component</h2>
        <ButtonDemo />
      </div>

      {/* Badge Component Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Badge Component</h2>
        <BadgeDemo />
      </div>

      {/* Interactive Combination Demo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Interactive Combination</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Selector</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={selectedStatus === 'success' ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setSelectedStatus('success')}
              >
                Success
              </Button>
              <Button 
                variant={selectedStatus === 'warning' ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setSelectedStatus('warning')}
              >
                Warning
              </Button>
              <Button 
                variant={selectedStatus === 'danger' ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setSelectedStatus('danger')}
              >
                Danger
              </Button>
              <Button 
                variant={selectedStatus === 'muted' ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setSelectedStatus('muted')}
              >
                Muted
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Selected status: <Badge tone={selectedStatus}>{selectedStatus}</Badge>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Buttons</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <Button variant="primary" onClick={handleButtonClick}>
                Primary Action
              </Button>
              <Button variant="secondary" onClick={handleButtonClick}>
                Secondary Action
              </Button>
              <Button variant="ghost" onClick={handleButtonClick}>
                Ghost Action
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Button clicks: <Badge tone="muted">{buttonClicks}</Badge>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Example</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Form Status:</span>
                <Badge tone="warning">Draft</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Validation:</span>
                <Badge tone="success">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Priority:</span>
                <Badge tone="danger">High</Badge>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" size="sm">
                  Submit Form
                </Button>
                <Button variant="secondary" size="sm">
                  Save Draft
                </Button>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Button</strong>: Use for all interactive actions with variants (primary, secondary, ghost) and sizes (sm, md)</p>
          <p>• <strong>Badge</strong>: Use for status indicators, labels, and metadata with semantic tones</p>
          <p>• Both components support custom className for additional styling</p>
          <p>• Components are fully accessible with proper focus states and ARIA support</p>
        </div>
      </div>
    </div>
  );
};

// Internal Button Demo Component
const ButtonDemo: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Variants */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleClick}>Primary</Button>
          <Button variant="secondary" onClick={handleClick}>Secondary</Button>
          <Button variant="ghost" onClick={handleClick}>Ghost</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={handleClick}>Small</Button>
          <Button size="md" onClick={handleClick}>Medium</Button>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">States</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleClick}>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Clicks: {clickCount} | <Button variant="ghost" size="sm" onClick={() => setClickCount(0)}>Reset</Button>
      </div>
    </div>
  );
};

// Internal Badge Demo Component
const BadgeDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Tones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tones</h3>
        <div className="flex flex-wrap gap-3">
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="muted">Muted</Badge>
        </div>
      </div>

      {/* Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Failed</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <Badge tone="danger">High</Badge>
            <Badge tone="warning">Medium</Badge>
            <Badge tone="success">Low</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimitivesDemo; 