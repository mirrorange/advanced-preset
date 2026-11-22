/** User-facing text of a multimodal request error. */
import { t } from '@/i18n';
import { MediaHttpError, ProxyError } from '@/media/net';
import { BodyOverrideError } from '@/media/request';

export function mediaErrorText(e: unknown): string {
  if (e instanceof ProxyError) return t(`media.error.proxy.${e.issue}`);
  if (e instanceof MediaHttpError) return e.message;
  if (e instanceof Error && e.name === 'NoImageConnection') return t('media.error.noConnection');
  if (e instanceof TypeError) return t('media.error.network');
  if (e instanceof BodyOverrideError) return t('media.error.body', { error: e.message });
  return e instanceof Error ? e.message : String(e);
}
