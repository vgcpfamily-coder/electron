# Documentação das Mudanças no módulo `adblocker.js`

## Objetivo
Este documento descreve as alterações realizadas no módulo `electron/adblocker.js` para melhorar o bloqueio de anúncios e a experiência de reprodução de vídeo no YouTube dentro do aplicativo Electron.

## Alterações realizadas

### 1. Ativação do bloqueador na sessão Electron
- Mantido o uso de `ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)` para carregar filtros pré-construídos de anúncios e rastreamento.
- Chamado `blocker.enableBlockingInSession(session)` para habilitar o bloqueio na sessão do Electron.

### 2. Injeção de CSS cosmético para ocultar elementos de anúncio
- Adicionado `adblockCosmeticCSS` com seletores específicos do YouTube para ocultar itens como:
  - `.video-ads`
  - `.ytp-ad-module`
  - `.ytp-ad-player-overlay`
  - `.ytp-ad-overlay-container`
  - `.ytp-paid-content-badge`
  - `.ytp-error-content`
  - `tp-yt-paper-dialog.ytd-popup-container>:last-child`
  - `tp-yt-iron-overlay-backdrop[opened]`
  - Vários seletores relacionados a `adblock` e `abp`
- O CSS é injetado em cada página carregada via `webContents.insertCSS`.

### 3. Ocultação dinâmica via JavaScript
- `injectAdblockerCosmetics(webContents)` injeta um script que:
  - Executa `hideAdElements()` para aplicar `display: none` em elementos de anúncio.
  - Usa `MutationObserver` para manter esses elementos ocultos enquanto a página muda dinamicamente.

### 4. Tentativa de bypass de detecção de adblock do YouTube
- Injetado um script que:
  - Limpa `ytInitialPlayerResponse.adPlacements` e `playerAds` se presentes.
  - Cria objetos falsos `window.google.ima.Ad` e `window.google.ima.AdDisplayContainer`.
  - Sobrescreve `window.ytplayer` para simular ausência de anúncios.
  - Injeta CSS para esconder mensagens de detecção de adblock.

### 5. Forçar autoplay em vídeos
- Adicionado `forceAutoplay()` no script injetado para tentar reproduzir automaticamente o vídeo:
  - Detecta o elemento `.video-stream.html5-main-video`.
  - Chama `video.play()` quando o vídeo estiver pausado.
  - Observa mudanças na árvore DOM e tenta novamente a cada segundo.

## Observações
- As alterações visam reduzir interferência visual de overlays de anúncio e detecção de adblock no YouTube.
- Alguns comportamentos do YouTube podem variar com atualizações do site, então seletores podem precisar de ajustes futuros.
- A parte de autoplay é uma tentativa: políticas de reprodução automática do Electron/navegador podem ainda bloquear a reprodução sem interação do usuário.

## Arquivos modificados
- `electron/adblocker.js`
- `electron/window.js`

## Como testar
1. Inicie o app Electron a partir da pasta `electron`.
2. Navegue para `https://www.youtube.com`.
3. Abra um vídeo e mude entre vídeos.
4. Verifique se overlays de anúncio são ocultados e se o vídeo tenta iniciar automaticamente.
