<template>
    <div class="container">
        <button class="createNewConvo" @click="createNewConvo">New Convo</button>
        <div class="conversation" v-for="(conversation, index) in conversations" @click="choseConvo(conversation)"
            :class="{ active: conversationIdRef === conversation.id }"
            ref="convoList" style="display: flex; align-items: center;">
            <div class="title">
                {{ conversation.title }}
            </div>
            <div class="convo-actions">
                <button class="title-change-btn" @click.stop="shareIndex(index)">/</button>
                <button class="delete-btn" @click.stop="handleConvoDelete(conversation, index)">-</button>
            </div>
        </div>
        <input type="text" v-model="newTitle" v-show="showTitle" @keypress="handleTitleChange">
    </div>
</template>

<script setup>
import { conversations, Conversation } from '@/states/conversation';
import { Message, messages } from '@/states/message';
import { conversationIdRef } from '@/states/user';
import { nextTick, ref, useTemplateRef } from 'vue';

//  message请求：
const choseConvo = async (conversation) => {
    messages.value = conversation.messages
    conversationIdRef.value = conversation.id;
    if (conversation.messages.length === 0 && conversation.id) {
        let conversationId = conversation.id;        // conversationId = newConvoId.value;
        const token = localStorage.getItem('token');
        const response = await fetch(`http://scj.dolmo.top:3001/api/conversations/${conversationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        messages.value = data.data.messages.map((message) => new Message(
            message['content'],
            message['created_at'],
            message['role'],
            message['images'].map((image) => image.url)))
        conversation.messages = messages.value
    }
}

//  新建convo:
const convoListRef = useTemplateRef('convoList')

const createNewConvo = async () => {
    conversations.value.push(new Conversation(null, `newConvo${conversations.value.length + 1}`))
    await nextTick();
    convoListRef.value[convoListRef.value.length - 1].click()
}

//  删除convo：
const handleConvoDelete = async (conversation, index) => {
    const conversationId = conversation.id
    conversations.value.splice(index, 1);
    const token = localStorage.getItem('token');
    const response = await fetch(`http://scj.dolmo.top:3001/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

//  修改title：
const showTitle = ref(false)
let titleIndex
const newTitle = ref('')
const shareIndex = (index) => {
    showTitle.value = true;
    newTitle.value = conversations.value[index].title
    titleIndex = index
}

const handleTitleChange = async (e) => {
    if (e.key !== 'Enter' || newTitle.value === '') return
    console.log();
    conversations.value[titleIndex].title = newTitle.value
    const token = localStorage.getItem('token');
    const response = await fetch(`http://scj.dolmo.top:3001/api/conversations/${conversationIdRef.value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: `${newTitle.value}` })
    });
    const data = await response.json();
    if (data.success) {
        newTitle.value = ''
        showTitle.value = false;
    }
}

defineExpose({ choseConvo })
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    width: 180px;
    flex-shrink: 0;
    border-right: 1px solid #eee;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fafafa;
}

.createNewConvo {
    margin-bottom: 15px;
    background: linear-gradient(135deg, #e0eafc, #cfdef3);
    color: #333;
}

.createNewConvo:hover {
    background: linear-gradient(135deg, #4b6cb7, #182848);
    color: white;
}

.conversation {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eaeaea;
    border-radius: 8px;
    margin-bottom: 5px;
    transition: background-color 0.3s ease;
}

.conversation:hover {
    background-color: #ececec;
}

.conversation.active {
    background-color: #d0d7e6;
    font-weight: bold;
}

.title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
}

.convo-actions {
    display: flex;
    gap: 5px;
}

button {
    border: none;
    outline: none;
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: linear-gradient(135deg, #4b6cb7, #182848);
    color: white;
}

.title-change-btn, .delete-btn {
    padding: 2px 6px;
    font-size: 12px;
}
</style>