
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { LessonContent } from './components/LessonContent';
import type { Lesson } from './types';
import { KeyboardIcon } from './components/icons/KeyboardIcon';
import { MouseIcon } from './components/icons/MouseIcon';
import { CombineIcon } from './components/icons/CombineIcon';

const lessonsData: Lesson[] = [
  {
    id: 1,
    title: 'Aula 1: Ativação por Teclado',
    icon: KeyboardIcon,
    description: [
        'Bem-vindo à primeira aula! Aqui, vamos aprender a fazer uma ferramenta (Tool) no Roblox responder a uma tecla específica do teclado. Usaremos o `UserInputService` para detectar quando um jogador pressiona uma tecla.',
        'O script abaixo deve ser colocado dentro da sua Tool. Ele verifica se a ferramenta está equipada e se a tecla "E" foi pressionada. A função `print` é usada para mostrar uma mensagem no console de saída (Output) do Roblox Studio, confirmando que o código funcionou.'
    ],
    code: `
-- Script dentro da Ferramenta (Tool)
local tool = script.Parent
local UserInputService = game:GetService("UserInputService")

tool.Equipped:Connect(function()
    print("Ferramenta equipada! Pressione 'E' para ativar.")
end)

UserInputService.InputBegan:Connect(function(input, gameProcessedEvent)
    -- Evita que a ação dispare se o jogador estiver digitando no chat
    if gameProcessedEvent then return end

    -- Verifica se a ferramenta está na mão do jogador local
    -- e se a tecla 'E' foi pressionada
    if tool.Parent == game.Players.LocalPlayer.Character and input.KeyCode == Enum.KeyCode.E then
        print("Tecla 'E' pressionada! Ação da ferramenta executada.")
        -- Coloque aqui a lógica da sua ferramenta (ex: um ataque, um efeito)
    end
end)
`
  },
  {
    id: 2,
    title: 'Aula 2: Ativação por Mouse (M1)',
    icon: MouseIcon,
    description: [
        'Nesta aula, vamos usar o método mais comum para ativar ferramentas: o clique do mouse. As ferramentas no Roblox têm um evento especial chamado `Activated` que dispara automaticamente quando o jogador clica com o botão esquerdo do mouse (M1) enquanto a segura.',
        'Este método é muito mais simples que o da Aula 1 para cliques de mouse, pois o Roblox já cuida de toda a detecção para nós. O evento `Activated` também funciona para o toque principal em dispositivos móveis, o que o torna muito versátil.'
    ],
    code: `
-- Script dentro da Ferramenta (Tool)
local tool = script.Parent

tool.Activated:Connect(function()
    -- Este evento é disparado pelo clique esquerdo do mouse (M1) no PC
    -- ou pelo toque principal na tela em dispositivos móveis.
    print("Ferramenta ativada com M1! Ação executada.")
    -- Coloque aqui a lógica da sua ferramenta
end)

tool.Equipped:Connect(function()
    print("Ferramenta equipada! Clique com o botão esquerdo do mouse para ativar.")
end)
`
  },
  {
    id: 3,
    title: 'Aula 3: UI Mobile e Unificação',
    icon: CombineIcon,
    description: [
        'Chegamos à aula final! Agora vamos juntar tudo o que aprendemos e adicionar suporte para jogadores de celular com um botão na tela (UI). A melhor prática é ter uma única função para a ação principal da ferramenta e chamá-la a partir de diferentes gatilhos (teclado, mouse, botão de UI).',
        'Este script cria um botão na tela quando a ferramenta é equipada e o remove quando ela é desequipada. Todos os três métodos de ativação (`E`, clique do mouse e o novo botão) agora chamam a mesma função `performAction()`, garantindo que sua ferramenta funcione da mesma forma em todas as plataformas.'
    ],
    code: `
-- Script Principal dentro da Ferramenta (Tool)

local tool = script.Parent
local player = game.Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")

-- Variáveis para a UI
local screenGui = nil
local actionButton = nil

-- Função central para a ação da ferramenta
local function performAction()
    print("AÇÃO EXECUTADA! Plataforma: " .. UserInputService:GetPlatform())
    -- Coloque sua lógica principal aqui (ex: animação, dano, som)
end

-- Aula 1: Ativação por Teclado (Tecla 'E')
UserInputService.InputBegan:Connect(function(input, gameProcessedEvent)
    if gameProcessedEvent then return end
    if tool.Parent == player.Character and input.KeyCode == Enum.KeyCode.E then
        performAction()
    end
end)

-- Aula 2: Ativação por Mouse (M1)
tool.Activated:Connect(function()
    performAction()
end)

-- Aula 3: Criação e conexão da UI para Mobile
local function createMobileUI()
    if screenGui then return end -- Não criar a UI duas vezes

    screenGui = Instance.new("ScreenGui", player.PlayerGui)
    actionButton = Instance.new("TextButton", screenGui)
    actionButton.Size = UDim2.new(0.2, 0, 0.1, 0)
    actionButton.Position = UDim2.new(0.78, 0, 0.85, 0)
    actionButton.AnchorPoint = Vector2.new(0.5, 0.5)
    actionButton.Text = "Usar"
    actionButton.BackgroundColor3 = Color3.new(0.2, 0.6, 1)
    actionButton.TextColor3 = Color3.new(1, 1, 1)
    actionButton.Font = Enum.Font.SourceSansBold
    actionButton.TextSize = 24

    -- Conecta o botão à nossa função de ação
    actionButton.MouseButton1Click:Connect(performAction)
end

-- Lógica de Equipar/Desequipar
tool.Equipped:Connect(function()
    print("Ferramenta equipada. Use M1, a tecla 'E' ou o botão na tela.")
    createMobileUI()
end)

tool.Unequipped:Connect(function()
    print("Ferramenta desequipada.")
    if screenGui then
        screenGui:Destroy()
        screenGui = nil
    end
end)
`
  },
];

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);

  const selectedLesson = lessonsData.find(lesson => lesson.id === selectedLessonId);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100" style={{fontFamily: "'Inter', sans-serif"}}>
      <Sidebar
        lessons={lessonsData}
        currentLessonId={selectedLessonId}
        onSelectLesson={setSelectedLessonId}
      />
      <LessonContent lesson={selectedLesson} />
    </div>
  );
}

export default App;
