<?php
require dirname(__DIR__) . '/src/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Spd\CrossGame;

$server = IoServer::factory(
		new WsServer(
				new CrossGame()
		)
		, 8080
);

$server->run();