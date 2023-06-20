# install-ziglint
This is a GitHub Action to install [`ziglint`](https://github.com/AnnikaCodes/ziglint) into your GitHub Actions job.

# Configuration
It automatically fetches the latest version of `ziglint`; perhaps in the future this Action can support specifying the desired `ziglint` version. This Action's version is unrelated to the `ziglint` version it will download.

You can optionally specify `binary-name` as an input to this Action, which will control the name that `ziglint` is downloaded to.

# Example Usage
```yaml
steps:
    - name: Check out code
      uses: actions/checkout@v2
    - name: Install ziglint
      uses: AnnikaCodes/install-ziglint@v0.1
    - name: Lint code
      run: ziglint
```
```yaml
steps:
    - name: Check out code
      uses: actions/checkout@v2
    - name: Install ziglint
      uses: AnnikaCodes/install-ziglint@v0.1
      with:
        binary-name: a_wacky_name_for_the_binary
    - name: Lint code
      run: a_wacky_name_for_the_binary
```
