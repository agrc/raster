import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { turnEmailsIntoLinks } from './MoreInfo';
// Mock the design system Link to a simple anchor to avoid CSS and web component imports in tests
vi.mock('@ugrc/utah-design-system', () => {
  const Link = ({ href, children }: { href?: string; children?: unknown }) => <a href={href}>{children as string}</a>;

  return { Link };
});

// Helper to render the function output inside a container div for easier assertions
function renderOutput(input: string | null | undefined) {
  return renderToStaticMarkup(<div>{turnEmailsIntoLinks(input)}</div>);
}

describe('turnEmailsIntoLinks', () => {
  it('returns original value for null/undefined (renders empty)', () => {
    expect(renderOutput(null)).toBe('<div></div>');
    // undefined children are omitted
    expect(renderOutput(undefined)).toBe('<div></div>');
  });

  it('renders plain text unchanged when there is no email', () => {
    const html = renderOutput('Contact us for details');

    expect(html).toContain('<div>Contact us for details</div>');
    expect(html).not.toContain('<a');
  });

  it('converts a single email into a mailto link and preserves surrounding text', () => {
    const html = renderOutput('Email me at user@example.com for help');

    expect(html).toContain('user@example.com');
    expect(html).toContain('href="mailto:user@example.com"');
    expect(html.startsWith('<div>Email me at')).toBe(true);
    expect(html.endsWith('for help</div>')).toBe(true);
  });

  it('converts multiple emails into separate links and keeps intermediate text', () => {
    const html = renderOutput('Primary: one@example.com, Backup: two@example.org');

    // Two distinct links
    expect((html.match(/href="mailto:/g) || []).length).toBe(2);
    expect(html).toContain('href="mailto:one@example.com"');
    expect(html).toContain('href="mailto:two@example.org"');

    // Commas and labels should remain
    expect(html).toContain('Primary: ');
    expect(html).toContain(', Backup: ');
  });

  it('does not include trailing punctuation in the email link', () => {
    const html = renderOutput('Reach us at support@example.com. Thanks!');

    expect(html).toContain('href="mailto:support@example.com"');
    // The period should remain outside the link
    expect(html).toMatch(/support@example\.com<\/a>\./);
    expect(html.endsWith(' Thanks!</div>')).toBe(true);
  });

  it('handles emails surrounded by parentheses or angle-bracket like characters', () => {
    const html = renderOutput('Contact (<user.name+tag@example.co.uk>) for details');

    expect(html).toContain('href="mailto:user.name+tag@example.co.uk"');
    // Parentheses should be preserved outside the link (note: angle brackets encoded)
    expect(html).toMatch(/\(&lt;<a [^>]*>user\.name\+tag@example\.co\.uk<\/a>&gt;\)/);
  });
});
