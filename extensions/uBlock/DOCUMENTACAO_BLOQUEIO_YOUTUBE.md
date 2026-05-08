# Como o uBlock Origin Bloqueia Anúncios no YouTube

## Introdução
O uBlock Origin é uma extensão de navegador que bloqueia anúncios de forma eficiente e personalizável. Para o YouTube, ele utiliza uma combinação de filtros de rede e filtros cosméticos para impedir a exibição de anúncios, melhorando a experiência do usuário.

## Mecanismos de Bloqueio

### 1. Filtros de Rede (Network Filters)
O uBlock Origin bloqueia solicitações de rede para URLs relacionadas a anúncios antes que elas sejam carregadas. Para o YouTube, isso inclui:
- Bloqueio de URLs como `youtube.com/pagead/` e `youtube.com/youtubei/v1/player/ad_break`, que são responsáveis por anúncios em vídeo.
- Prevenção do carregamento de anúncios do Google AdSense e DoubleClick, que o YouTube utiliza.

Esses filtros são definidos em listas como o EasyList, que são atualizadas regularmente pelos mantenedores.

### 2. Filtros Cosméticos (Cosmetic Filters)
Além de bloquear solicitações, o uBlock oculta elementos visuais da página que são anúncios. No YouTube:
- Oculta overlays de anúncios, banners laterais e elementos como `.video-ads` usando seletores CSS.
- Remove botões de "Pular anúncio" ou anúncios não puláveis aplicando regras de ocultação.

Isso é feito injetando scripts no conteúdo da página via `contentscript.js`, que monitora mudanças no DOM e aplica as regras de filtragem.

### 3. Filtragem Dinâmica e Personalizada
Usuários podem adicionar regras personalizadas no painel do uBlock para bloquear anúncios específicos que não estão cobertos pelas listas padrão.

## Como Funciona no YouTube
Quando você assiste a um vídeo no YouTube:
1. O uBlock intercepta solicitações de anúncios e as bloqueia.
2. Elementos de anúncio são ocultados dinamicamente à medida que a página carrega.
3. Resultado: Vídeos sem interrupções de anúncios, carregamento mais rápido e menos uso de dados.

## Limitações
- Anúncios incorporados em vídeos (como anúncios não puláveis) podem ser mais difíceis de bloquear devido a mudanças no YouTube.
- O YouTube frequentemente atualiza seu código, exigindo atualizações nas listas de filtros.

Para mais detalhes, consulte a documentação oficial do uBlock Origin ou as listas de filtros em `assets/thirdparties/easylist/`.