import { describe, expect, it } from 'vitest';
import { checkTemplate, compileTemplate, renderTemplate, templateCode, templateLiterals, TemplateError } from '../src';

const data = { name: 'Ana <b>&"\'', list: ['a', 'b', 'c'], n: 3 };

describe('templates (EJS compatibility)', () => {
  // Expected outputs were produced by ejs 7.0.2 (`ejs.render(source, data)` with default options).
  const cases: [string, string][] = [
    ["Hello <%= name %>!", "Hello Ana &lt;b&gt;&amp;&#34;&#39;!"],
    ["Hello <%- name %>!", "Hello Ana <b>&\"'!"],
    ["<% for (const x of list) { %>- <%= x %>\n<% } %>end", "- a\n- b\n- c\nend"],
    ["<% for (const x of list) { -%>\n- <%= x %>\n<% } -%>\nend", "- a\n- b\n- c\nend"],
    ["  <%_ if (n > 1) { _%>\n  many\n  <%_ } _%>\nend", "  many\nend"],
    ["<%# a comment %>x", "x"],
    ["lit <%% not %> code %%> end", "lit <% not %> code %> end"],
    ["<%= null %>|<%- undefined %>|<%= 0 %>|<%- false %>", "||0|false"],
    ["<% // comment %>ok", "ok"],
    ["<%= n; %>", "3"],
    ["<%- list.join(\", \") -%>\n\nnext", "a, b, c\nnext"],
    ["x <%_ %>   y", "x   y"],
    ["<% if (n) { %>\n  yes\n<% } else { %>\n  no\n<% } %>", "\n  yes\n"],
    ["\"quotes\" \\ back\\slash <%= \"\\\\\" %>", "\"quotes\" \\ back\\slash \\"],
    ["<%- locals.n %> <%= typeof foo %>", "3 undefined"],
    ["<%% -%>\nafter", "<% -%>after"],
    ["%%> lone", "%> lone"],
    ["multi\n<%\n const a = 1;\n const b = 2;\n%>\n<%= a + b %>", "multi\n\n3"],
    ["trail -%>\nx", "trail x"],
  ];
  it.each(cases)('renders %j like EJS', (src, expected) => {
    expect(renderTemplate(src, data)).toBe(expected);
  });

  it('rejects an output tag that contains an opening tag, like EJS', () => {
    expect(checkTemplate('<%- "<%" %>')).toBeInstanceOf(TemplateError);
  });

  it('reports unclosed tags with their line', () => {
    const e = checkTemplate('a\nb <%= x');
    expect(e).toBeInstanceOf(TemplateError);
    expect(e!.message).toContain('Could not find matching close tag for "<%="');
    expect(e!.line).toBe(2);
  });

  it('reports syntax errors without running anything', () => {
    expect(checkTemplate('<% if ( { %>')).toBeInstanceOf(TemplateError);
    expect(checkTemplate('<% throw new Error("never runs") %>')).toBeNull();
  });

  it('reports runtime errors with the line of the failing tag', () => {
    let err: unknown;
    try { renderTemplate('one\ntwo\n<%= missing.value %>', {}); } catch (e) { err = e; }
    expect(err).toBeInstanceOf(TemplateError);
    expect((err as TemplateError).line).toBe(3);
    expect((err as TemplateError).message).toMatch(/ReferenceError: missing is not defined/);
  });

  it('does not support include()', () => {
    expect(() => renderTemplate('<%- include("x") %>', {})).toThrow(/include\(\) is not supported/);
  });

  it('memoises compiled templates', () => {
    expect(compileTemplate('<%= n %>')).toBe(compileTemplate('<%= n %>'));
  });

  it('splits literal text and code', () => {
    const src = 'Hi {{ap::name::user}} <%= a %><%# c %> <%% x %> <% if (b) { %>yes<% } %>';
    expect(templateLiterals(src).join('')).toBe('Hi {{ap::name::user}}  <% x %> yes');
    expect(templateCode(src).map((s) => s.trim())).toEqual(['a', 'if (b) {', '}']);
  });
});
