import React from 'react';
import { Badge } from './Badge';

export const BadgeDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Basic Tones Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Tones</h3>
        <div className="flex flex-wrap gap-4">
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="muted">Muted</Badge>
        </div>
      </div>

      {/* Default Tone */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Tone (Muted)</h3>
        <div className="flex flex-wrap gap-4">
          <Badge>Default Badge</Badge>
          <Badge>Another Badge</Badge>
        </div>
      </div>

      {/* Contextual Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contextual Examples</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="muted">Unknown</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Priority:</span>
            <Badge tone="danger">High</Badge>
            <Badge tone="warning">Medium</Badge>
            <Badge tone="success">Low</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Category:</span>
            <Badge tone="muted">General</Badge>
            <Badge tone="success">Feature</Badge>
            <Badge tone="warning">Bug</Badge>
            <Badge tone="danger">Critical</Badge>
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h3>
        <div className="flex flex-wrap gap-4">
          <Badge tone="success" className="border border-emerald-300">
            Success with Border
          </Badge>
          <Badge tone="warning" className="shadow-sm">
            Warning with Shadow
          </Badge>
          <Badge tone="danger" className="font-bold">
            Danger Bold
          </Badge>
          <Badge tone="muted" className="uppercase tracking-wide">
            Muted Uppercase
          </Badge>
        </div>
      </div>

      {/* Real-world Usage */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-world Usage</h3>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Assignment Submission</h4>
              <Badge tone="success">Submitted</Badge>
            </div>
            <p className="text-sm text-gray-600">Your assignment has been successfully submitted.</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Analysis Status</h4>
              <Badge tone="warning">Processing</Badge>
            </div>
            <p className="text-sm text-gray-600">Your text analysis is currently being processed.</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">System Alert</h4>
              <Badge tone="danger">Critical</Badge>
            </div>
            <p className="text-sm text-gray-600">Immediate attention required for this issue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDemo; 