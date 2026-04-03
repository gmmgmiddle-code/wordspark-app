import { useState, useEffect } from 'react'
import './App.css'
import csvData from '../list-random-word/list-random-word.csv?raw'

function App() {
  const [data, setData] = useState({})
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [currentWord, setCurrentWord] = useState('กดปุ่มเพื่อสุ่มคำ')
  const [isCopied, setIsCopied] = useState(false)
  const [history, setHistory] = useState([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    parseCSV(csvData)
  }, [])

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n')
    if (lines.length === 0) return

    const headers = lines[0].split(',')
    const result = {}
    
    headers.forEach((header, index) => {
      const cleanHeader = header.trim()
      result[cleanHeader] = []
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',')
        if (row[index]) {
          result[cleanHeader].push(row[index].trim())
        }
      }
    })

    const categoryList = Object.keys(result)
    setData(result)
    setCategories(categoryList)
    if (categoryList.length > 0) {
      setActiveCategory(categoryList[0])
    }
  }

  const generateWord = () => {
    if (!activeCategory || !data[activeCategory]) return
    
    const words = data[activeCategory]
    const randomIndex = Math.floor(Math.random() * words.length)
    const newWord = words[randomIndex]
    
    setCurrentWord(newWord)
    setHistory(prev => [newWord, ...prev.slice(0, 19)])
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div className="app-container">
      <header>
        <div style={{ width: '40px' }}></div> {/* Spacer */}
        <h1>WordSpark</h1>
        <button className="history-toggle" onClick={() => setIsHistoryOpen(true)} title="ประวัติการสุ่ม">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        </button>
      </header>

      <div className="categories-container">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="hero-display">
        <div className="word-display">
          {currentWord}
        </div>
        
        {currentWord !== 'กดปุ่มเพื่อสุ่มคำ' && (
          <button className="copy-button" onClick={() => copyToClipboard(currentWord)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {isCopied ? 'คัดลอกแล้ว!' : 'คัดลอกคำศัพท์'}
          </button>
        )}
      </main>

      <div className="action-area">
        <button className="generate-button" onClick={generateWord}>
          สุ่มคำใหม่
        </button>
      </div>

      {/* History Drawer */}
      <div className={`drawer-overlay ${isHistoryOpen ? 'visible' : ''}`} onClick={() => setIsHistoryOpen(false)}></div>
      <div className={`history-drawer ${isHistoryOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>ประวัติการสุ่ม</h2>
          <button className="close-drawer" onClick={() => setIsHistoryOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="history-list">
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>ยังไม่มีประวัติการสุ่ม</p>
          ) : (
            history.map((word, index) => (
              <div key={index} className="history-item" onClick={() => {
                setCurrentWord(word)
                setIsHistoryOpen(false)
              }}>
                {word}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`toast ${isCopied ? 'visible' : ''}`}>
        คัดลอกลงคลิปบอร์ดเรียบร้อย!
      </div>
    </div>
  )
}

export default App
