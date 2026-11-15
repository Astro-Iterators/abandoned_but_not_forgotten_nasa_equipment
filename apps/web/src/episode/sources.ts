export interface SourceReference {
  id: string;
  title: string;
  url: string;
  note: string;
  type: 'primary' | 'educational';
}

export const EPISODE_SOURCES: SourceReference[] = [
  {
    id: 'nasa-ranger7',
    title: 'NASA Science — Ranger 7 Mission',
    url: 'https://science.nasa.gov/mission/ranger-7',
    note: 'Fonte canónica da missão Ranger 7: objectivo fotográfico de aproximação e impacto lunar planeado em 31 de Julho de 1964.',
    type: 'primary',
  },
  {
    id: 'nasa-nssdc-ranger7',
    title: 'NASA Space Science Data Coordinated Archive (NSSDCA) — Ranger 7',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1964-043A',
    note: 'Registo oficial do envio de mais de 4.300 imagens lunares de alta resolução antes do impacto planeado no Mare Cognitum.',
    type: 'primary',
  },
  {
    id: 'nasa-mariner4',
    title: 'NASA Science — Mariner 4 Mission Overview',
    url: 'https://science.nasa.gov/mission/mariner-4',
    note: 'Primeiro sobrevoo bem-sucedido de Marte (Julho de 1965). Mencionado apenas como gancho histórico no epílogo.',
    type: 'primary',
  },
];

export const EDITORIAL_DISCLAIMER =
  'Aviso Editorial: Bip, o Arquivo, a viagem e os vestígios são representações ilustrativas e ficção educativa. ' +
  'A missão Ranger 7 da NASA não sofreu avaria de motor nem foi uma tentativa falhada de alunagem; ' +
  'o seu objectivo científico era transmitir imagens de alta resolução durante a descida até ao impacto planeado, ' +
  'fornecendo dados cruciais para o programa Apollo.';
