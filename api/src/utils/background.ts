export const handleBackgroundOperations = async (
  existingBackgroundUrl: string | null
) => {
  if (!existingBackgroundUrl) return null;
  const backgroundParts = existingBackgroundUrl.split('workspace-backgrounds/');
  if (backgroundParts.length > 1) {
    return backgroundParts[1].split('.')[0];
  }
  return null;
};