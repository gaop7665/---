# Contributing to CF URL Shortener

Thank you for your interest in contributing to CF URL Shortener! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear title and description
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Node.js version, etc.)
- Screenshots if applicable

### Suggesting Features

We love new ideas! Open an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git commit -m "Add some feature"
   ```
   
   Please write clear commit messages explaining what you changed and why.

4. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

### Code Style

- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code formatting
- Keep functions small and focused

### Testing

Before submitting a PR:
- Test your changes locally with `npm run dev`
- Ensure the Worker deploys successfully
- Test all affected features in the UI
- Check that existing functionality still works

### Areas We Need Help

- 🐛 Bug fixes
- 📝 Documentation improvements
- 🌐 Translations
- ✨ New features
- 🎨 UI/UX improvements
- 🔒 Security enhancements

## Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cf-url-shortener.git
   cd cf-url-shortener
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a KV namespace for testing
   ```bash
   npx wrangler kv:namespace create "URL_DB" --preview
   ```

4. Update `wrangler.toml` with your preview namespace ID

5. Start development server
   ```bash
   npm run dev
   ```

## Questions?

Feel free to open an issue with your question, or reach out to the maintainers.

## Code of Conduct

Be respectful and inclusive. We want this to be a welcoming community for everyone.

Thank you for contributing! 🎉

