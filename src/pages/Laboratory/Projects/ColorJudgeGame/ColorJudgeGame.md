- ### 我 1

  我想做一個顏色判斷遊戲，放進我的 Lab 頁面。就是使用一個背景色，比如紅色，但是中間寫著不同顏色的文字（文字內容是背景顏色），比如綠色。使用者要說出文字上實際的顏色。

  撰寫建議：

  - 使用 TypeScript
  - 樣式風格請參考其他 components
  - 主程式邏輯與介面分開，另外使用 hook 來處理
  - 根據此項目 i18n 設定，為此遊戲提供 繁中/英文 支援

  遊戲玩法：

  - 畫面顯示一個有顏色的背景（如紅色），中間有一段文字（如「綠色」）。
  - 文字內容是背景色的名稱，但文字本身顏色與背景不同。
  - 背景色要跟當前文字一樣，比如文字顯示「紅色」，背景色就是紅色。
  - 使用者要根據「文字的顏色」而不是「文字內容」來選擇答案。
  - 可設計倒數計時、分數統計、排行榜等功能。

---

- ### Claude 3.7 sonnet (Cursor) 1

  好的，以下是「顏色判斷遊戲」的完整功能規劃與具體程式設計建議，請你確認或補充：

  ---

  ## 一、功能規劃

  ### 1. 遊戲流程

  - 點擊「開始遊戲」→ 顯示題目（背景色＋文字）→ 使用者選擇答案 → 顯示正確/錯誤 → 進入下一題
  - 設定題數或倒數計時（如 60 秒）
  - 遊戲結束顯示分數與正確率

  ### 2. 題目邏輯

  - 顏色清單（如：紅、綠、藍、黃、紫、橙、黑、白）
  - 隨機選擇背景色
  - 隨機選擇一個不同的顏色名稱作為文字內容
  - 文字顏色隨機（但不能與背景色相同）
  - 選項：顯示多個顏色按鈕，使用者需選出「文字本身的顏色」

  ### 3. UI/UX

  - 顯示倒數計時/剩餘題數
  - 顯示目前分數
  - 顯示正確/錯誤動畫（react-spring）
  - 響應式設計，手機/桌機皆可玩

  ### 4. 國際化

  - 支援繁體中文、英文
  - 顏色名稱、按鈕、提示皆多語系

  ### 5. 進階功能（可選）

  - 排行榜（localStorage）
  - 遊戲難度選擇（顏色數量、題目速度）
  - 音效/音樂

  ---

  ## 二、檔案與元件結構建議

  ```txt
  src/
    components/
      ColorJudgeGame/
        ColorJudgeGame.tsx         // 主元件，控制遊戲流程
        ColorJudgePanel.tsx        // 顯示題目與選項
        ColorJudgeResult.tsx       // 顯示分數/結果
        colorJudgeGame.module.scss // 樣式
        hooks/
          useColorJudgeGame.ts     // 遊戲邏輯 hook
        types.ts                   // 型別定義
    i18n/
      locales/
        components/
          colorJudgeGame/
            zh-TW.json
            en.json
  ```

  ---

  ## 三、主要型別設計（TypeScript）

  ```ts
  // types.ts
  export type ColorName = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange' | 'black' | 'white'

  export interface ColorQuestion {
    backgroundColor: ColorName      // = textContent
    textColor: ColorName            // 文字本身顏色（正確答案）
    textContent: ColorName          // 文字內容（顏色名稱，決定背景色）
    options: ColorName[]            // 選項
    correctAnswer: ColorName        // = textColor
  }
  ```

  ---

  ## 四、主要 Hook 設計

  ```ts
  // useColorJudgeGame.ts
  export interface UseColorJudgeGameReturn {
    question: ColorQuestion
    score: number
    timeLeft: number
    isGameOver: boolean
    handleAnswer: (color: ColorName) => void
    startGame: () => void
    // ...
  }
  ```

  ---

  ## 五、UI/UX 流程

  1. 遊戲開始畫面（Start 按鈕）
  2. 顯示題目（背景色＋文字＋選項）
  3. 使用者點選答案，顯示正確/錯誤動畫
  4. 進入下一題，直到結束
  5. 顯示分數與再玩一次按鈕

  ---

  ## 六、i18n 鍵值建議

  ```json
  // zh-TW.json
  {
    "start": "開始遊戲",
    "score": "分數",
    "time_left": "剩餘時間",
    "correct": "正確！",
    "wrong": "錯誤！",
    "play_again": "再玩一次",
    "color": {
      "red": "紅色",
      "green": "綠色",
      "blue": "藍色",
      "yellow": "黃色",
      "purple": "紫色",
      "orange": "橙色",
      "black": "黑色",
      "white": "白色"
    }
  }
  ```

  ---

  ## 七、互動討論

  1. 顏色數量是否要自訂？（還是先用 8 種基本色）
  2. 題目數量 or 倒數計時？（還是兩者都要）
  3. 是否需要排行榜或難度選擇？
  4. 介面風格有沒有特別想法？（如新年風、極簡風等）

  ---

  請你確認以上規劃，或針對細節補充、調整，確認後我會開始建立檔案與撰寫程式！

---

- **我**(2)

  好的，請你開始好的，請你開始撰寫程式邏輯。請你依照上述的規劃，完成這個小遊戲，並放入到Lab頁面中。
  
---

- **Claude 3.7 sonnet - Cursor**(2)

  > Listed 18 items in src/components

  > Listed 5 items in src/pages/Laboratory

  > Listed 2 items in src/pages/Laboratory/Projects

  > Listed 3 items in src/pages/Laboratory/Projects/Schedule

  > Listed 3 items in src/pages/Laboratory/Projects/ShortcutUrlGenerator

  > Listed 18 items in src/components

  > Listed 6 items in src/i18n/locales/components

  > Listed 2 items in src/i18n/locales/components/fireworks

  > Listed 2 items in src/pages/Laboratory/Projects

  > Read file: src/App.tsx

  > Writing File...

  顏色判斷遊戲的主要程式與結構已完成，並已整合進 Lab 頁面，包含：

  1. **遊戲元件與邏輯**  
     - 完整的 ColorJudgeGame 主元件、useColorJudgeGame hook、型別定義、SCSS 樣式。
     - 題目邏輯：背景色與文字內容一致，文字顏色隨機，選項需選出「文字顏色」。
     - 支援分數、倒數計時、正確/錯誤提示、再玩一次。

  2. **多語系支援**
     - 已建立 zh-TW 與 en-US 翻譯檔，顏色名稱、按鈕、提示皆可切換語言。

  3. **路由與入口**  
     - 已於 Lab 頁面（/lab）新增「顏色判斷遊戲」入口，點擊即可進入 /lab/color-judge。

  4. **樣式**  
     - 採用 SCSS module，支援主題色、響應式、動畫效果。

  ---

  ### 下一步建議

  - 你可以直接在 Lab 頁面測試這個遊戲。
  - 若需進階功能（排行榜、難度選擇、音效等）可再討論擴充。
  - 若有任何細節想調整（如顏色數量、題目時間、UI 風格），也可隨時提出。

  請問要進行測試，還是有其他細節想優化？
