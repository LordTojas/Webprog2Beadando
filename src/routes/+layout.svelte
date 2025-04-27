<script>
    import '../app.scss';
  </script>
  
  <div class="app">
    <header>
      <nav class="container">
        <a href="/">Kezdőoldal</a>
        <a href="/matches">Matches</a>
        <a href="/players">Players</a>
        <a href="/chat">Chat</a>
        <a href="/guess">GuessGame</a>
      </nav>
    </header>
  
    <main class="container">
      <div class="content">
        <slot />
      </div>
    </main>
  </div>