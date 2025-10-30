"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("react-dom/server");
var vitest_1 = require("vitest");
var MoreInfo_1 = require("./MoreInfo");
// Mock the design system Link to a simple anchor to avoid CSS and web component imports in tests
vitest_1.vi.mock('@ugrc/utah-design-system', function () {
    var Link = function (_a) {
        var href = _a.href, children = _a.children;
        return <a href={href}>{children}</a>;
    };
    return { Link: Link };
});
// Helper to render the function output inside a container div for easier assertions
function renderOutput(input) {
    return (0, server_1.renderToStaticMarkup)(<div>{(0, MoreInfo_1.turnEmailsIntoLinks)(input)}</div>);
}
(0, vitest_1.describe)('turnEmailsIntoLinks', function () {
    (0, vitest_1.it)('returns original value for null/undefined (renders empty)', function () {
        (0, vitest_1.expect)(renderOutput(null)).toBe('<div></div>');
        // undefined children are omitted
        (0, vitest_1.expect)(renderOutput(undefined)).toBe('<div></div>');
    });
    (0, vitest_1.it)('renders plain text unchanged when there is no email', function () {
        var html = renderOutput('Contact us for details');
        (0, vitest_1.expect)(html).toContain('<div>Contact us for details</div>');
        (0, vitest_1.expect)(html).not.toContain('<a');
    });
    (0, vitest_1.it)('converts a single email into a mailto link and preserves surrounding text', function () {
        var html = renderOutput('Email me at user@example.com for help');
        (0, vitest_1.expect)(html).toContain('user@example.com');
        (0, vitest_1.expect)(html).toContain('href="mailto:user@example.com"');
        (0, vitest_1.expect)(html.startsWith('<div>Email me at')).toBe(true);
        (0, vitest_1.expect)(html.endsWith('for help</div>')).toBe(true);
    });
    (0, vitest_1.it)('converts multiple emails into separate links and keeps intermediate text', function () {
        var html = renderOutput('Primary: one@example.com, Backup: two@example.org');
        // Two distinct links
        (0, vitest_1.expect)((html.match(/href="mailto:/g) || []).length).toBe(2);
        (0, vitest_1.expect)(html).toContain('href="mailto:one@example.com"');
        (0, vitest_1.expect)(html).toContain('href="mailto:two@example.org"');
        // Commas and labels should remain
        (0, vitest_1.expect)(html).toContain('Primary: ');
        (0, vitest_1.expect)(html).toContain(', Backup: ');
    });
    (0, vitest_1.it)('does not include trailing punctuation in the email link', function () {
        var html = renderOutput('Reach us at support@example.com. Thanks!');
        (0, vitest_1.expect)(html).toContain('href="mailto:support@example.com"');
        // The period should remain outside the link
        (0, vitest_1.expect)(html).toMatch(/support@example\.com<\/a>\./);
        (0, vitest_1.expect)(html.endsWith(' Thanks!</div>')).toBe(true);
    });
    (0, vitest_1.it)('handles emails surrounded by parentheses or angle-bracket like characters', function () {
        var html = renderOutput('Contact (<user.name+tag@example.co.uk>) for details');
        (0, vitest_1.expect)(html).toContain('href="mailto:user.name+tag@example.co.uk"');
        // Parentheses should be preserved outside the link (note: angle brackets encoded)
        (0, vitest_1.expect)(html).toMatch(/\(&lt;<a [^>]*>user\.name\+tag@example\.co\.uk<\/a>&gt;\)/);
    });
});
