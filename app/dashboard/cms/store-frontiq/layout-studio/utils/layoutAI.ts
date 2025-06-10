export const suggestLayoutsByToneAndType = (designTone: string, pageType: string) => {
    // Simple mock AI logic
    if (pageType === 'Homepage' && designTone === 'Luxury') {
      return ['layout_1col', 'layout_2col_3070'];
    }
    return ['layout_3col_equal', 'layout_1_2_1'];
  };
  