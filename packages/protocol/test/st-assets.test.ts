import { describe, expect, it } from 'vitest';
import { regexFromString, stQuickReplySet, type QuickReplyDecl, type QuickReplySetDecl } from '../src';

const reply = (over: Partial<QuickReplyDecl>): QuickReplyDecl => ({
  id: 'x', label: '', icon: '', showLabel: false, title: '', message: '', contextList: [], preventAutoExecute: true, isHidden: false, automationId: '',
  executeOnStartup: false, executeOnUser: false, executeOnAi: false, executeOnChatChange: false, executeOnGroupMemberDraft: false, executeOnNewChat: false, executeBeforeGeneration: false,
  ...over,
});

const set: QuickReplySetDecl = {
  id: 'main', name: 'AP · Demo', global: true, visible: true,
  disableSend: false, placeBeforeInput: false, injectInput: false, color: 'transparent', onlyBorderColor: false,
  qrList: [
    reply({ id: 'meta', label: 'Meta', icon: 'fa-at', message: '/setinput {{input}} @{{ap::name::narrator}}', contextList: [{ set: 'AP · Demo · more', isChained: false }] }),
    reply({ id: 'sum', label: 'Summary {{ap::param::x}}', title: 'Ask {{ap::name::narrator}}', message: '@{{ap::name::narrator}} Summarize.\n{{input}}' }),
  ],
};

describe('Quick Reply sets', () => {
  it('numbers the replies, expands {{ap::name}} and leaves other macros to ST', () => {
    const st = stQuickReplySet(set, (a) => (a === 'narrator' ? 'Nia' : undefined));
    expect(st).toMatchObject({ version: 2, name: 'AP · Demo', idIndex: 2 });
    expect(st.qrList.map((q) => q.id)).toEqual([1, 2]);
    expect(st.qrList[0]).toMatchObject({ label: 'Meta', icon: 'fa-at', message: '/setinput {{input}} @Nia', contextList: [{ set: 'AP · Demo · more', isChained: false }] });
    expect(st.qrList[1]).toMatchObject({ label: 'Summary {{ap::param::x}}', title: 'Ask Nia', message: '@Nia Summarize.\n{{input}}' });
  });

  it('uses translations by reply id', () => {
    const st = stQuickReplySet(set, () => 'Nia', { qrList: { sum: { label: '总结', message: '@{{ap::name::narrator}} 请总结。' }, meta: { title: '' } } });
    expect(st.qrList[1]).toMatchObject({ label: '总结', title: 'Ask Nia', message: '@Nia 请总结。' });
    expect(st.qrList[0]!.label).toBe('Meta');
  });

  it('does not share context lists with the declaration', () => {
    const st = stQuickReplySet(set, () => 'Nia');
    st.qrList[0]!.contextList[0]!.isChained = true;
    expect(set.qrList[0]!.contextList[0]!.isChained).toBe(false);
  });
});

describe('regexFromString (as ST)', () => {
  it('reads /pattern/flags and bare patterns', () => {
    expect(regexFromString('/a+b/gi')).toEqual(/a+b/gi);
    expect(regexFromString('a+b')!.source).toBe('a+b');
    expect(regexFromString('/(/g')).toBeUndefined();
  });
});
