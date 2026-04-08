import React from 'react'
import styles from '../styles/SectionComplete.module.css'

export default function SectionComplete({ sectionLabel }) {
  return (
    <div className={styles.container}>
      ✓ {sectionLabel} Complete!
    </div>
  )
}