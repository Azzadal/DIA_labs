package com.tusur.lab.controller;

import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeoutException;

import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebSocketTest {

    private Logger logger = LoggerFactory.getLogger("application");
    private BlockingQueue<String> blockingQueue;
    private WebSocketStompClient stompClient;
    private StompSession session;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @BeforeEach
    public void setup() throws InterruptedException, TimeoutException, ExecutionException {
        blockingQueue = new LinkedBlockingDeque<>();
        stompClient = new WebSocketStompClient(new SockJsClient(
                Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()))));
        stompClient.setMessageConverter(new StringMessageConverter());

        session = stompClient
                .connect("http://localhost:8080/tasker/", new MySessionHandler())
                .get(1, SECONDS);

        Thread.sleep(5000);
    }

    @Test
    public void verifyGreetingIsReceived() throws Exception {
        logger.info("run!!!");

        final String message = "myMessage";
        messagingTemplate.convertAndSend("/app/welcome/", message);
        String response = blockingQueue.poll(5, SECONDS);
        //        TestObj obj = blockingQueue.poll(10, SECONDS);
//        System.out.println(obj);
        assertNotNull(response);




//        session.subscribe("/topic/message", new StompFrameHandler() {
//
//            @Override
//            public Type getPayloadType(StompHeaders headers) {
//                logger.info("headers " + headers);
//                System.out.println("headers " + headers);
//                return TestObj.class;
//            }
//
//            @SneakyThrows
//            @Override
//            public void handleFrame(StompHeaders headers, Object payload) {
//                logger.info("Received message: " + payload);
//                System.out.println("Received message: " + payload);
//                blockingQueue.offer((TestObj) payload, 500, MILLISECONDS);
//            }
//        });
//
//        session.send("/app/welcome", "Mike");
//
//        TestObj obj = blockingQueue.poll(10, SECONDS);
//        System.out.println(obj);
//        assertNotNull(obj);
    }

    private List<Transport> createTransportClient() {
        List<Transport> transports = new ArrayList<>(1);
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        return transports;
    }

    private class MySessionHandler extends StompSessionHandlerAdapter {
        private Logger logger = LoggerFactory.getLogger("MySessionHandler");
        @Override
        public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
            session.subscribe("/topic/message/", this);
        }

        @Override
        public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
            logger.warn("Stomp Error:", exception);
        }

        @Override
        public void handleTransportError(StompSession session, Throwable exception) {
            super.handleTransportError(session, exception);
            logger.warn("Stomp Transport Error:", exception);
        }


        @Override
        public Type getPayloadType(StompHeaders headers) {
            logger.info("headers " + headers);
            System.out.println("headers " + headers);
            return String.class;
        }

        @SneakyThrows
        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            logger.info("Received message: " + payload);
            System.out.println("Received message: " + payload);
            blockingQueue.offer((String) payload, 500, MILLISECONDS);
        }
    }
}

