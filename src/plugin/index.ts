/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  PluginAction,
  PluginCallbackFunction,
  PluginMessagePayload,
} from '../shared';

figma.showUI(__html__);

// Mocked data
const mockedData = {
  'ProductName': '제주 친환경 1박스 3Kg??',
  'State': '판매중지??',
  'bullet': '●???',
  'ProductID': '10025723???',
  'Stock': '150??',
  'OriginPrice': '$100',
  'FinalPrice': '$80',
  'Pre-orderPrice': '$70',
  'RegistrationHistory': '01/01/2024???',
  'RecentEditHistory': '01/02/2024???',
};

async function loadFonts() {
  await figma.loadFontAsync({
    family: 'Spoqa Han Sans Neo',
    style: 'Medium',
  });

  await figma.loadFontAsync({
    family: 'Spoqa Han Sans Neo',
    style: 'Regular',
  });
}

function isPayload(payload: unknown): payload is PluginMessagePayload {
  return (
    typeof payload === 'object' &&
    Object.prototype.hasOwnProperty.call(payload, 'type') &&
    Object.prototype.hasOwnProperty.call(payload, 'randomQuote')
  );
}

// 노드와 하위 모든 텍스트 레이어를 재귀적으로 업데이트하는 함수
function updateTextNodesRecursively(node: SceneNode, newText: string) {
  if (node?.type === 'TEXT') {
    node.characters = newText;
  } else if ('children' in node) {
    node.children.forEach((child) =>
      updateTextNodesRecursively(child, newText),
    );
  }
}

function dfs(node: SceneNode) {
  if (node.name in mockedData) {
    updateTextNodesRecursively(node, mockedData[node.name]);
    return;
  }

  if ('children' in node) {
    node.children.forEach((child) => dfs(child));
  }
}

function generateRandomQuote({ randomQuote }: PluginMessagePayload) {
  figma.currentPage.selection.forEach((node) => dfs(node));
}

loadFonts().then(() => {
  figma.ui.onmessage = (payload: unknown) => {
    const callbackMap: Record<PluginAction, PluginCallbackFunction> = {
      generateRandomQuote,
    };

    if (isPayload(payload) && callbackMap[payload.type]) {
      callbackMap[payload.type](payload);
    }
  };
});
