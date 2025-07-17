// components/Pagination.tsx
import React from 'react'
import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Pokaż wszystkie strony jeśli jest mało
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Pokaż z elipsami
      if (currentPage <= 3) {
        // Początek
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Koniec
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Środek
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className={styles.pagination}>
      <button 
        className={`${styles.btn} ${styles.prevNext}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        ← Poprzednia
      </button>
      
      <div className={styles.pages}>
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={styles.ellipsis}>...</span>
            ) : (
              <button
                className={`${styles.btn} ${styles.pageBtn} ${
                  page === currentPage ? styles.active : ''
                }`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <button 
        className={`${styles.btn} ${styles.prevNext}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Następna →
      </button>
    </div>
  )
}
