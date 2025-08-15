import React from 'react';
import { tokens } from '../design-system/tokens';

/**
 * TokenDemo Component
 * Demonstrates how to use the design system tokens
 */
const TokenDemo: React.FC = () => {
  return (
    <div className="p-8 bg-surface-alt min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-h1 text-text mb-8">Design System Tokens Demo</h1>
        
        {/* Colors Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Color Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tokens.colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-2 rounded-md shadow-card"
                  style={{ backgroundColor: color }}
                />
                <p className="text-body font-medium">{name}</p>
                <p className="text-muted">{color}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Typography Tokens</h2>
          <div className="space-y-4">
            <h1 className={tokens.typography.h1}>Heading 1 - {tokens.typography.h1}</h1>
            <h2 className={tokens.typography.h2}>Heading 2 - {tokens.typography.h2}</h2>
            <h3 className={tokens.typography.h3}>Heading 3 - {tokens.typography.h3}</h3>
            <p className={tokens.typography.body}>Body text - {tokens.typography.body}</p>
            <p className={tokens.typography.muted}>Muted text - {tokens.typography.muted}</p>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Spacing Scale</h2>
          <div className="space-y-4">
            {tokens.spacing_scale.map((spacing) => (
              <div key={spacing} className="flex items-center">
                <div 
                  className="bg-primary rounded-sm"
                  style={{ 
                    width: `${spacing}px`, 
                    height: '20px' 
                  }}
                />
                <span className="ml-4 text-body">{spacing}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Border Radius Tokens</h2>
          <div className="flex gap-6">
            {Object.entries(tokens.radius).map(([name, radius]) => (
              <div key={name} className="text-center">
                <div 
                  className="w-20 h-20 bg-primary"
                  style={{ borderRadius: `${radius}px` }}
                />
                <p className="text-body mt-2">{name}: {radius}px</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shadow Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Shadow Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-surface rounded-lg shadow-card">
              <h3 className="text-h3 mb-4">Card with Shadow</h3>
              <p className="text-body">This card uses the card shadow token: {tokens.shadow.card}</p>
            </div>
            <div className="p-8 bg-surface rounded-lg border border-border">
              <h3 className="text-h3 mb-4">Card without Shadow</h3>
              <p className="text-body">This card has no shadow for comparison</p>
            </div>
          </div>
        </section>

        {/* Breakpoints Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Breakpoint Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tokens.breakpoints).map(([name, breakpoint]) => (
              <div key={name} className="text-center p-4 bg-surface rounded-md border border-border">
                <p className="text-body font-medium">{name}</p>
                <p className="text-muted">{breakpoint}px</p>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Examples Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Usage Examples</h2>
          
          {/* Button Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-4">Button Components</h3>
            <div className="flex gap-4 flex-wrap">
              <button className="px-6 py-3 bg-primary text-surface rounded-md hover:bg-primary-soft transition-colors">
                Primary Button
              </button>
              <button className="px-6 py-3 bg-success text-surface rounded-md hover:opacity-90 transition-opacity">
                Success Button
              </button>
              <button className="px-6 py-3 bg-warning text-surface rounded-md hover:opacity-90 transition-opacity">
                Warning Button
              </button>
              <button className="px-6 py-3 bg-danger text-surface rounded-md hover:opacity-90 transition-opacity">
                Danger Button
              </button>
            </div>
          </div>

          {/* Card Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-4">Card Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-surface rounded-lg shadow-card border border-border">
                <h4 className="text-h3 mb-2">Feature Card</h4>
                <p className="text-body text-muted">This card demonstrates the surface color, border, and shadow tokens.</p>
              </div>
              <div className="p-6 bg-surface-alt rounded-lg border border-border">
                <h4 className="text-h3 mb-2">Alt Surface Card</h4>
                <p className="text-body text-muted">This card uses the alternative surface color for subtle variation.</p>
              </div>
              <div className="p-6 bg-primary text-surface rounded-lg">
                <h4 className="text-h3 mb-2">Primary Card</h4>
                <p className="text-body">This card uses the primary color with white text for contrast.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section className="mb-12">
          <h2 className="text-h2 text-text mb-6">Code Examples</h2>
          <div className="bg-sidebar text-surface p-6 rounded-lg font-mono text-sm">
            <p className="mb-4">// Using TypeScript tokens</p>
            <p className="mb-2">import &#123; tokens, getColor &#125; from './design-system/tokens';</p>
            <p className="mb-2">const primaryColor = getColor('primary');</p>
            <p className="mb-2">const cardRadius = getRadius('md');</p>
            <p className="mb-4">const cardShadow = getShadow('card');</p>
            <br />
            <p className="mb-4">// Using Tailwind classes</p>
            <p className="mb-2">className="bg-primary text-surface rounded-md shadow-card"</p>
            <br />
            <p className="mb-4">// Using CSS custom properties</p>
            <p className="mb-2">style=&#123;&#123; backgroundColor: 'var(--color-primary)' &#125;&#125;</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TokenDemo; 