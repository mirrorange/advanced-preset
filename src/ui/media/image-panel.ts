/** Open the image panel of a message's image prompt in the media dialog. */
import { t } from '@/i18n';
import { openMediaDialog } from './dialog';
import ImagePanel from './ImagePanel.vue';

export function openImagePanel(mesid: number, structure: string, index: number): void {
  openMediaDialog({ component: ImagePanel, props: { mesid, structure, index }, title: t('media.image.panel') });
}
